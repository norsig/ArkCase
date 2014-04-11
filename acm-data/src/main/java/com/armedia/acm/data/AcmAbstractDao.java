package com.armedia.acm.data;


import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

public abstract class AcmAbstractDao<T>
{
    @PersistenceContext
    private EntityManager em;

    public T save(T toSave)
    {
        T saved = em.merge(toSave);
        em.persist(saved);
        return saved;
    }

    public EntityManager getEm()
    {
        return em;
    }
}
