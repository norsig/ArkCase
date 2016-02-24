package com.armedia.acm.service.outlook.model;

import java.util.Date;

import com.armedia.acm.core.model.AcmEvent;

public class CalendarEventAddedEvent extends AcmEvent
{
    private static final long serialVersionUID = 1L;
    private static final String EVENT_TYPE = "com.armedia.acm.outlook.calendar.added";
    
    public CalendarEventAddedEvent(OutlookCalendarItem source, String userId)
    {
        super(source);
        setEventDate(new Date());
        setObjectType("CALENDAR_ITEM");
        setUserId(userId);
    }
    
    @Override
    public String getEventType()
    {
        return EVENT_TYPE;
    }
}
