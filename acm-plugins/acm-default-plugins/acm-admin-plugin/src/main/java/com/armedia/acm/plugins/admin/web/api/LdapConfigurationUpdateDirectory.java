package com.armedia.acm.plugins.admin.web.api;

import com.armedia.acm.plugins.admin.exception.AcmLdapConfigurationException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

/**
 * Created by sergey.kolomiets  on 5/26/15.
 */
@Controller
@RequestMapping( { "/api/v1/plugin/admin", "/api/latest/plugin/admin"} )
public class LdapConfigurationUpdateDirectory {
    private Logger log = LoggerFactory.getLogger(getClass());

    private LdapConfigurationService ldapConfigurationService;

    @RequestMapping(value = "/ldapconfiguration/directories/{directoryId}", method = RequestMethod.PUT, produces = {
            MediaType.APPLICATION_JSON_VALUE, MediaType.TEXT_PLAIN_VALUE
    })

    @ResponseBody
    public String updateDirectory(
            @RequestBody String resource,
            @PathVariable("directoryId") String directoryId,
            HttpServletResponse response) throws IOException, AcmLdapConfigurationException {

        try {

            JSONObject ldapObject = new JSONObject(resource);
            if (directoryId == null) {
                throw new AcmLdapConfigurationException("Directory Id is undefined");
            }

            Map<String, Object> props = ldapConfigurationService.getProperties(ldapObject);
            ldapConfigurationService.updateLdapDirectory(directoryId, props);

        } catch (Exception e) {
            if (log.isErrorEnabled()) {
                log.error("Can't update LDAP directory", e);
            }
            throw new AcmLdapConfigurationException("Update LDAP directory error", e);
        }

        return "{}";
    }

    public void setLdapConfigurationService(LdapConfigurationService ldapConfigurationService) {
        this.ldapConfigurationService = ldapConfigurationService;
    }
}