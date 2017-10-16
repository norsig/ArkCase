package com.armedia.acm.plugins.admin.web.api;

import com.armedia.acm.services.email.sender.model.EmailSenderConfiguration;
import com.armedia.acm.services.email.sender.service.EmailSenderConfigurationServiceImpl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author sasko.tanaskoski
 *
 */
@Controller
@RequestMapping({ "/api/v1/plugin/admin", "/api/latest/plugin/admin" })
public class EmailSenderConfigurationAPIController
{

    private Logger log = LoggerFactory.getLogger(getClass());

    private EmailSenderConfigurationServiceImpl emailSenderConfigurationService;

    @RequestMapping(value = "/email/configuration", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public EmailSenderConfiguration getConfiguration()
    {
        return emailSenderConfigurationService.readConfiguration();

    }

    @RequestMapping(value = "/email/configuration", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public void updateConfiguration(@RequestBody EmailSenderConfiguration configuration, Authentication auth)
    {
        emailSenderConfigurationService.writeConfiguration(configuration, auth);
    }

    @RequestMapping(value = "/email/configuration/validate", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public boolean validateSmtpConfiguration(@RequestBody EmailSenderConfiguration configuration, Authentication auth)
    {
        return emailSenderConfigurationService.validateSmtpConfiguration(configuration);
    }

    /**
     * @param emailSenderConfigurationService
     *            the emailSenderConfigurationService to set
     */
    public void setEmailSenderConfigurationService(EmailSenderConfigurationServiceImpl emailSenderConfigurationService)
    {
        this.emailSenderConfigurationService = emailSenderConfigurationService;
    }

}