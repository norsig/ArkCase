package com.armedia.mule.cmis.kerberos;

/*-
 * #%L
 * ACM Mule CMIS Connector
 * %%
 * Copyright (C) 2014 - 2018 ArkCase LLC
 * %%
 * This file is part of the ArkCase software. 
 * 
 * If the software was purchased under a paid ArkCase license, the terms of 
 * the paid license agreement will prevail.  Otherwise, the software is 
 * provided under the following open source license terms:
 * 
 * ArkCase is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *  
 * ArkCase is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License
 * along with ArkCase. If not, see <http://www.gnu.org/licenses/>.
 * #L%
 */

import org.apache.chemistry.opencmis.client.bindings.spi.AbstractAuthenticationProvider;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.bindings.spi.cookies.CmisCookieManager;
import org.apache.chemistry.opencmis.commons.SessionParameter;
import org.apache.chemistry.opencmis.commons.impl.DateTimeHelper;
import org.apache.chemistry.opencmis.commons.impl.XMLUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.xml.parsers.ParserConfigurationException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by bojan.milenkoski on 30.9.2016
 */
public class KerberosAuthenticationProvider extends AbstractAuthenticationProvider
{
    private static final long serialVersionUID = 1L;
    private static final String WSSE_NAMESPACE = "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd";
    private static final String WSU_NAMESPACE = "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd";
    private final Logger LOG = LoggerFactory.getLogger(getClass());
    private boolean sendUsernameToken;

    private CmisCookieManager cookieManager;
    private Map<String, List<String>> fixedHeaders = new HashMap<>();

    @Override
    public void setSession(BindingSession session)
    {
        super.setSession(session);

        sendUsernameToken = isTrue(SessionParameter.AUTH_SOAP_USERNAMETOKEN);

        if (isTrue(SessionParameter.COOKIES))
        {
            cookieManager = new CmisCookieManager();
        }

        // other headers
        int x = 0;
        Object headerParam;
        while ((headerParam = getSession().get(SessionParameter.HEADER + "." + x)) != null)
        {
            String header = headerParam.toString();
            int colon = header.indexOf(':');
            if (colon > -1)
            {
                String key = header.substring(0, colon).trim();
                if (key.length() > 0)
                {
                    String value = header.substring(colon + 1).trim();
                    List<String> values = fixedHeaders.get(key);
                    if (values == null)
                    {
                        fixedHeaders.put(key, Collections.singletonList(value));
                    }
                    else
                    {
                        List<String> newValues = new ArrayList<>(values);
                        newValues.add(value);
                        fixedHeaders.put(key, newValues);
                    }
                }
            }
            x++;
        }
    }

    @Override
    public Map<String, List<String>> getHTTPHeaders(String url)
    {
        Map<String, List<String>> result = new HashMap<>(fixedHeaders);

        // cookies
        if (cookieManager != null)
        {
            Map<String, List<String>> cookies = cookieManager.get(url, result);
            if (!cookies.isEmpty())
            {
                result.putAll(cookies);
            }
        }

        return result.isEmpty() ? null : result;
    }

    @Override
    public void putResponseHeaders(String url, int statusCode, Map<String, List<String>> headers)
    {
        if (cookieManager != null)
        {
            cookieManager.put(url, headers);
        }
    }

    @Override
    public Element getSOAPHeaders(Object portObject)
    {
        // only send SOAP header if configured
        if (!sendUsernameToken)
        {
            return null;
        }

        // get user and password
        String user = getUser();
        String password = getPassword();

        // if no user is set, don't create SOAP header
        if (user == null)
        {
            return null;
        }

        if (password == null)
        {
            password = "";
        }

        // set time
        long created = System.currentTimeMillis();
        long expires = created + 24 * 60 * 60 * 1000; // 24 hours

        // create the SOAP header
        try
        {
            Document document = XMLUtils.newDomDocument();

            Element wsseSecurityElement = document.createElementNS(WSSE_NAMESPACE, "Security");

            Element wsuTimestampElement = document.createElementNS(WSU_NAMESPACE, "Timestamp");
            wsseSecurityElement.appendChild(wsuTimestampElement);

            Element tsCreatedElement = document.createElementNS(WSU_NAMESPACE, "Created");
            tsCreatedElement.appendChild(document.createTextNode(DateTimeHelper.formatXmlDateTime(created)));
            wsuTimestampElement.appendChild(tsCreatedElement);

            Element tsExpiresElement = document.createElementNS(WSU_NAMESPACE, "Expires");
            tsExpiresElement.appendChild(document.createTextNode(DateTimeHelper.formatXmlDateTime(expires)));
            wsuTimestampElement.appendChild(tsExpiresElement);

            Element usernameTokenElement = document.createElementNS(WSSE_NAMESPACE, "UsernameToken");
            wsseSecurityElement.appendChild(usernameTokenElement);

            Element usernameElement = document.createElementNS(WSSE_NAMESPACE, "Username");
            usernameElement.appendChild(document.createTextNode(user));
            usernameTokenElement.appendChild(usernameElement);

            Element passwordElement = document.createElementNS(WSSE_NAMESPACE, "Password");
            passwordElement.appendChild(document.createTextNode(password));
            passwordElement.setAttribute("Type",
                    "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText");
            usernameTokenElement.appendChild(passwordElement);

            Element createdElement = document.createElementNS(WSU_NAMESPACE, "Created");
            createdElement.appendChild(document.createTextNode(DateTimeHelper.formatXmlDateTime(created)));
            usernameTokenElement.appendChild(createdElement);

            return wsseSecurityElement;
        }
        catch (ParserConfigurationException e)
        {
            // shouldn't happen...
            LOG.error("Parser configuration error", e);
        }

        return null;
    }

    /**
     * Returns <code>true</code> if the given parameter exists in the session and is set to true, <code>false</code>
     * otherwise.
     */
    protected boolean isTrue(String parameterName)
    {
        Object value = getSession().get(parameterName);

        if (value instanceof Boolean)
        {
            return ((Boolean) value).booleanValue();
        }

        if (value instanceof String)
        {
            return Boolean.parseBoolean((String) value);
        }

        return false;
    }
}
