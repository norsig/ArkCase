
/**
 * 
 */
package com.armedia.acm.plugins.complaint.model.complaint;

import java.util.Date;
import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElements;

import com.armedia.acm.form.config.Item;
import com.armedia.acm.plugins.addressable.model.PostalAddress;


/**
 * @author riste.tutureski
 *
 */
@XmlAccessorType(XmlAccessType.FIELD)
public class Complaint {
	
	private Long complaintId;
	private String complaintNumber;
	private String complaintTitle;
	private String category;
	private List<String> categories;
	private String complaintDescription;
	private String priority;
	private List<String> priorities;
	
	@XmlElements({
		@XmlElement(name="date"),
		@XmlElement(name="incidentDate")
		
	})
	private Date date;
	private String complaintTag;
	private String frequency;
	private List<String> frequencies;
	private PostalAddress location;
	private Contact initiator;
	private List<Contact> people;
    private String cmisFolderId;
    
    @XmlElements({
		@XmlElement(name="owners"),
		@XmlElement(name="ownersItem")
		
	})
    private List<Item> owners;
    private List<String> ownersOptions;
    
    @XmlElements({
		@XmlElement(name="followers"),
		@XmlElement(name="followersItem")
		
	})
    private List<Item> followers;
    private List<String> followersOptions;

    /**
	 * @return the complaintId
	 */
	public Long getComplaintId() {
		return complaintId;
	}
	
	/**
	 * @param complaintId the complaintId to set
	 */
	public void setComplaintId(Long complaintId) {
		this.complaintId = complaintId;
	}
	
	/**
	 * @return the complaintNumber
	 */
	public String getComplaintNumber() {
		return complaintNumber;
	}
	
	/**
	 * @param complaintNumber the complaintNumber to set
	 */
	public void setComplaintNumber(String complaintNumber) {
		this.complaintNumber = complaintNumber;
	}
	
	/**
	 * @return the complaintTitle
	 */
	public String getComplaintTitle() {
		return complaintTitle;
	}

	/**
	 * @param complaintTitle the complaintTitle to set
	 */
	public void setComplaintTitle(String complaintTitle) {
		this.complaintTitle = complaintTitle;
	}

	/**
	 * @return the category
	 */
	public String getCategory() {
		return category;
	}
	
	/**
	 * @param category the category to set
	 */
	public void setCategory(String category) {
		this.category = category;
	}
	
	/**
	 * @return the categories
	 */
	public List<String> getCategories() {
		return categories;
	}
	
	/**
	 * @param categories the categories to set
	 */
	public void setCategories(List<String> categories) {
		this.categories = categories;
	}
	
	/**
	 * @return the complaintDescription
	 */
	public String getComplaintDescription() {
		return complaintDescription;
	}
	
	/**
	 * @param complaintDescription the complaintDescription to set
	 */
	public void setComplaintDescription(String complaintDescription) {
		this.complaintDescription = complaintDescription;
	}
	
	/**
	 * @return the priority
	 */
	public String getPriority() {
		return priority;
	}
	
	/**
	 * @param priority the priority to set
	 */
	public void setPriority(String priority) {
		this.priority = priority;
	}
	
	/**
	 * @return the priorities
	 */
	public List<String> getPriorities() {
		return priorities;
	}
	
	/**
	 * @param priorities the priorities to set
	 */
	public void setPriorities(List<String> priorities) {
		this.priorities = priorities;
	}
	
	/**
	 * @return the date
	 */
	public Date getDate() {
		return date;
	}
	
	/**
	 * @param date the date to set
	 */
	public void setDate(Date date) {
		this.date = date;
	}
	
	/**
	 * @return the complaintTag
	 */
	public String getComplaintTag() {
		return complaintTag;
	}
	
	/**
	 * @param complaintTag the complaintTag to set
	 */
	public void setComplaintTag(String complaintTag) {
		this.complaintTag = complaintTag;
	}
	
	/**
	 * @return the frequency
	 */
	public String getFrequency() {
		return frequency;
	}
	
	/**
	 * @param frequency the frequency to set
	 */
	public void setFrequency(String frequency) {
		this.frequency = frequency;
	}
	
	/**
	 * @return the frequencies
	 */
	public List<String> getFrequencies() {
		return frequencies;
	}
	
	/**
	 * @param frequencies the frequencies to set
	 */
	public void setFrequencies(List<String> frequencies) {
		this.frequencies = frequencies;
	}
	
	/**
	 * @return the location
	 */
	public PostalAddress getLocation() {
		return location;
	}

	/**
	 * @param location the location to set
	 */
	public void setLocation(PostalAddress location) {
		this.location = location;
	}

	/**
	 * @return the initiator
	 */
	public Contact getInitiator() {
		return initiator;
	}
	
	/**
	 * @param initiator the initiator to set
	 */
	public void setInitiator(Contact initiator) {
		this.initiator = initiator;
	}
	
	/**
	 * @return the people
	 */
	public List<Contact> getPeople() {
		return people;
	}
	
	/**
	 * @param people the people to set
	 */
	public void setPeople(List<Contact> people) {
		this.people = people;
	}

    public String getCmisFolderId()
    {
        return cmisFolderId;
    }

    public void setCmisFolderId(String cmisFolderId)
    {
        this.cmisFolderId = cmisFolderId;
    }

	/**
	 * @return the owners
	 */
	public List<Item> getOwners() {
		return owners;
	}

	/**
	 * @param owners the owners to set
	 */
	public void setOwners(List<Item> owners) {
		this.owners = owners;
	}

	/**
	 * @return the ownersOptions
	 */
	public List<String> getOwnersOptions() {
		return ownersOptions;
	}

	/**
	 * @param ownersOptions the ownersOptions to set
	 */
	public void setOwnersOptions(List<String> ownersOptions) {
		this.ownersOptions = ownersOptions;
	}

	/**
	 * @return the followers
	 */
	public List<Item> getFollowers() {
		return followers;
	}

	/**
	 * @param followers the followers to set
	 */
	public void setFollowers(List<Item> followers) {
		this.followers = followers;
	}

	/**
	 * @return the followersOptions
	 */
	public List<String> getFollowersOptions() {
		return followersOptions;
	}

	/**
	 * @param followersOptions the followersOptions to set
	 */
	public void setFollowersOptions(List<String> followersOptions) {
		this.followersOptions = followersOptions;
	}

}