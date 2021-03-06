package com.armedia.acm.plugins.ecm.dao;

/*-
 * #%L
 * ACM Service: Enterprise Content Management
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

import com.armedia.acm.data.AcmAbstractDao;
import com.armedia.acm.plugins.ecm.model.AcmContainer;
import com.armedia.acm.plugins.ecm.model.EcmFile;
import com.armedia.acm.plugins.ecm.model.EcmFileConstants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.FlushModeType;
import javax.persistence.NoResultException;
import javax.persistence.NonUniqueResultException;
import javax.persistence.Query;
import javax.persistence.TypedQuery;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by armdev on 4/22/14.
 */
public class EcmFileDao extends AcmAbstractDao<EcmFile>
{
    private final Logger LOG = LoggerFactory.getLogger(getClass());

    @Override
    protected Class<EcmFile> getPersistenceClass()
    {
        return EcmFile.class;
    }

    @Override
    public String getSupportedObjectType()
    {
        return EcmFileConstants.OBJECT_FILE_TYPE;
    }

    public List<EcmFile> findForContainer(Long containerId)
    {
        String jpql = "SELECT e " +
                "FROM EcmFile e " +
                "WHERE e.container.id = :containerId";
        Query query = getEm().createQuery(jpql);
        query.setParameter("containerId", containerId);

        List<EcmFile> results = query.getResultList();

        return results;
    }

    public int changeContainer(AcmContainer containerFrom, AcmContainer containerTo, List<String> excludeDocumentTypes)
    {
        if (excludeDocumentTypes == null)
            excludeDocumentTypes = new LinkedList<>();
        String jpql = "UPDATE EcmFile e SET e.container=:containerTo, e.modified=:modifiedDate " +
                "WHERE e.container = :containerFrom" + (excludeDocumentTypes.isEmpty() ? "" : " AND e.fileType NOT IN :fileTypes");
        Query query = getEm().createQuery(jpql);
        query.setParameter("containerFrom", containerFrom);
        query.setParameter("containerTo", containerTo);
        query.setParameter("modifiedDate", new Date());
        if (!excludeDocumentTypes.isEmpty())
            query.setParameter("fileTypes", excludeDocumentTypes);

        int retval = query.executeUpdate();

        return retval;
    }

    public EcmFile findForContainerAttachmentFolderAndFileType(Long containerId, Long folderId, String fileType)
    {
        String jpql = "SELECT e " +
                "FROM EcmFile e " +
                "WHERE e.container.id = :containerId " +
                "AND e.container.attachmentFolder.id = :folderId " +
                "AND e.fileType = :fileType";

        return executeJpqlForContainerIdFolderIdAndFileType(jpql, containerId, folderId, fileType);
    }

    private EcmFile executeJpqlForContainerIdFolderIdAndFileType(String jpql, Long containerId, Long folderId, String fileType)
    {
        Query query = getEm().createQuery(jpql);

        query.setParameter("containerId", containerId);
        query.setParameter("folderId", folderId);
        query.setParameter("fileType", fileType);

        EcmFile result = null;

        try
        {
            result = (EcmFile) query.getSingleResult();
        }
        catch (NoResultException e)
        {
            LOG.debug("Cannot find EcmFile for containerId=[{}], folderId=[{}] and fileType=[{}]", containerId, folderId, fileType, e);
        }
        catch (NonUniqueResultException e1)
        {
            LOG.error("Cannot find unique EcmFile for containerId=[{}], folderId=[{}] and fileType=[{}]. Multiple files found ...",
                    containerId, folderId, fileType, e1);
        }

        return result;
    }

    public EcmFile findByCmisFileIdAndFolderId(String cmisFileId, Long folderId)
    {

        String jpql = "SELECT e FROM EcmFile e WHERE e.versionSeriesId = :cmisFileId and e.folder.id=:folderId";

        TypedQuery<EcmFile> query = getEm().createQuery(jpql, getPersistenceClass());

        query.setParameter("cmisFileId", cmisFileId);
        query.setParameter("folderId", folderId);

        EcmFile file = query.getSingleResult();

        return file;
    }

    public List<EcmFile> findByCmisFileId(String cmisFileId)
    {
        String jpql = "SELECT e FROM EcmFile e WHERE e.versionSeriesId = :cmisFileId";

        TypedQuery<EcmFile> query = getEm().createQuery(jpql, getPersistenceClass());

        query.setParameter("cmisFileId", cmisFileId);

        return query.getResultList();
    }

    @Transactional
    public void deleteFile(Long id)
    {
        EcmFile file = getEm().find(getPersistenceClass(), id);
        getEm().remove(file);
    }

    public List<EcmFile> findByFolderId(Long folderId)
    {
        return findByFolderId(folderId, FlushModeType.AUTO);
    }

    public List<EcmFile> findByFolderId(Long folderId, FlushModeType flushModeType)
    {
        String jpql = "SELECT e FROM EcmFile e WHERE e.folder.id=:folderId";

        TypedQuery<EcmFile> query = getEm().createQuery(jpql, getPersistenceClass());

        query.setParameter("folderId", folderId);

        query.setFlushMode(flushModeType);

        return query.getResultList();

    }

    public List<EcmFile> getFilesWithoutParticipants()
    {
        String jpql = "SELECT e FROM EcmFile e WHERE e.fileId  NOT IN " +
                "(SELECT p.objectId FROM AcmParticipant p WHERE p.objectType ='FILE')";

        TypedQuery<EcmFile> query = getEm().createQuery(jpql, getPersistenceClass());

        return query.getResultList();
    }

    public Long getFilesCount(LocalDateTime createdUntil)
    {
        String queryText = "SELECT COUNT(ecmFile) FROM EcmFile ecmFile WHERE ecmFile.created < :until";

        Query query = getEm().createQuery(queryText);
        query.setParameter("until", Date.from(ZonedDateTime.of(createdUntil, ZoneId.systemDefault()).toInstant()));
        return (Long) query.getSingleResult();
    }
}
