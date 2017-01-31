package com.armedia.acm.correspondence.model;

import java.util.Map;

/**
 * @author Lazo Lazarev a.k.a. Lazarius Borg @ zerogravity Jan 26, 2017
 *
 */
public class CorrespondenceTemplateConfiguration
{

    private String documentType;

    private String templateFilename;

    private String correspondenceQueryBeanId;

    private Map<String, String> templateSubstitutionVariables;

    private String dateFormatString;

    private String numberFormatString;

    /**
     * @return the documentType
     */
    public String getDocumentType()
    {
        return documentType;
    }

    /**
     * @param documentType the documentType to set
     */
    public void setDocumentType(String documentType)
    {
        this.documentType = documentType;
    }

    /**
     * @return the templateFilename
     */
    public String getTemplateFilename()
    {
        return templateFilename;
    }

    /**
     * @param templateFilename the templateFilename to set
     */
    public void setTemplateFilename(String templateFilename)
    {
        this.templateFilename = templateFilename;
    }

    /**
     * @return the correspondenceQueryBeanId
     */
    public String getCorrespondenceQueryBeanId()
    {
        return correspondenceQueryBeanId;
    }

    /**
     * @param correspondenceQueryBeanId the correspondenceQueryBeanId to set
     */
    public void setCorrespondenceQueryBeanId(String correspondenceQueryBeanId)
    {
        this.correspondenceQueryBeanId = correspondenceQueryBeanId;
    }

    /**
     * @return the templateSubstitutionVariables
     */
    public Map<String, String> getTemplateSubstitutionVariables()
    {
        return templateSubstitutionVariables;
    }

    /**
     * @param templateSubstitutionVariables the templateSubstitutionVariables to set
     */
    public void setTemplateSubstitutionVariables(Map<String, String> templateSubstitutionVariables)
    {
        this.templateSubstitutionVariables = templateSubstitutionVariables;
    }

    /**
     * @return the dateFormatString
     */
    public String getDateFormatString()
    {
        return dateFormatString;
    }

    /**
     * @param dateFormatString the dateFormatString to set
     */
    public void setDateFormatString(String dateFormatString)
    {
        this.dateFormatString = dateFormatString;
    }

    /**
     * @return the numberFormatString
     */
    public String getNumberFormatString()
    {
        return numberFormatString;
    }

    /**
     * @param numberFormatString the numberFormatString to set
     */
    public void setNumberFormatString(String numberFormatString)
    {
        this.numberFormatString = numberFormatString;
    }

}
