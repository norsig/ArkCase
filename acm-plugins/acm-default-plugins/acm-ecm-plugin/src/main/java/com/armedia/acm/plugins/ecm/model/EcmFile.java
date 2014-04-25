package com.armedia.acm.plugins.ecm.model;

import com.armedia.acm.plugins.objectassociation.model.ObjectAssociation;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;

@Entity
@Table(name = "acm_file")
public class EcmFile
{
    @Id
    @Column(name = "cm_file_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fileId;

    @Column(name = "cm_file_status")
    private String status;

    @Column(name = "cm_file_created", nullable = false, insertable = true, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date created;

    @Column(name = "cm_file_creator", insertable = true, updatable = false)
    private String creator;

    @Column(name = "cm_file_modified", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date modified;

    @Column(name = "cm_file_modifier")
    private String modifier;

    @Column(name = "cm_file_ecm_id")
    private String ecmFileId;

    @Column(name = "cm_file_name")
    private String fileName;

    @Column(name = "cm_file_mime_type")
    private String fileMimeType;

    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "cm_target_id")
    private Collection<ObjectAssociation> parentObjects = new ArrayList<>();

    @PrePersist
    protected void beforeInsert()
    {
        setCreated(new Date());
        setModified(new Date());

        if ( getStatus() == null || getStatus().trim().isEmpty() )
        {
            setStatus("ACTIVE");
        }

        for ( ObjectAssociation parentObject : parentObjects )
        {
            parentObject.setTargetId(fileId);
            parentObject.setTargetName(fileName);
            parentObject.setTargetType("FILE");

            if ( parentObject.getCreator() == null )
            {
                parentObject.setCreator(creator);
            }

            if ( parentObject.getModifier() == null )
            {
                parentObject.setModifier(modifier);
            }
        }
    }

    @PreUpdate
    protected void beforeUpdate()
    {
        setModified(new Date());
    }


    public Long getFileId()
    {
        return fileId;
    }

    public void setFileId(Long fileId)
    {
        this.fileId = fileId;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    public Date getCreated()
    {
        return created;
    }

    public void setCreated(Date created)
    {
        this.created = created;
    }

    public String getCreator()
    {
        return creator;
    }

    public void setCreator(String creator)
    {
        this.creator = creator;
    }

    public Date getModified()
    {
        return modified;
    }

    public void setModified(Date modified)
    {
        this.modified = modified;
    }

    public String getModifier()
    {
        return modifier;
    }

    public void setModifier(String modifier)
    {
        this.modifier = modifier;
    }

    public String getEcmFileId()
    {
        return ecmFileId;
    }

    public void setEcmFileId(String ecmFileId)
    {
        this.ecmFileId = ecmFileId;
    }

    public String getFileName()
    {
        return fileName;
    }

    public void setFileName(String fileName)
    {
        this.fileName = fileName;
    }

    public String getFileMimeType()
    {
        return fileMimeType;
    }

    public void setFileMimeType(String fileMimeType)
    {
        this.fileMimeType = fileMimeType;
    }

    public Collection<ObjectAssociation> getParentObjects()
    {
        return Collections.unmodifiableCollection(parentObjects);
    }

    public void addParentObject(ObjectAssociation parentObject)
    {
        parentObjects.add(parentObject);
        parentObject.setTargetName(getFileName());
        parentObject.setTargetType("FILE");
        parentObject.setTargetId(getFileId());
    }
}
