/**
 * 
 */
package com.armedia.acm.form.casefile.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.armedia.acm.form.casefile.model.AddressHistory;
import com.armedia.acm.form.casefile.model.CaseFileForm;
import com.armedia.acm.form.casefile.model.EmploymentHistory;
import com.armedia.acm.form.casefile.model.Subject;
import com.armedia.acm.plugins.addressable.model.PostalAddress;
import com.armedia.acm.plugins.casefile.model.CaseFile;
import com.armedia.acm.plugins.person.model.Organization;
import com.armedia.acm.plugins.person.model.Person;
import com.armedia.acm.plugins.person.model.PersonAssociation;
import com.armedia.acm.plugins.person.model.PersonIdentification;

/**
 * @author riste.tutureski
 *
 */
public class CaseFileFactory 
{

	public CaseFile asAcmCaseFile(CaseFileForm form, CaseFile caseFile)
	{
		if (caseFile == null)
		{
			caseFile = new CaseFile();
		}
		
		caseFile.setTitle(form.getTitle());
		caseFile.setCaseType(form.getType());
		
		if (form.getSubject() != null)
		{
			PersonAssociation personAssociation = null;
			Person person = null;
			
			if (caseFile.getOriginator() != null)
			{
				personAssociation = caseFile.getOriginator();
			}
			else
			{
				personAssociation = new PersonAssociation();
			}
			
			if (caseFile.getOriginator() != null && caseFile.getOriginator().getPerson() != null)
			{
				person = caseFile.getOriginator().getPerson();
			}
			else
			{
				person = new Person();
			}
			
			personAssociation.setPerson(person);
			
			caseFile.setOriginator(personAssociation);
			
			populatePerson(form, personAssociation, person);
		}
		
		return caseFile;
	}
	
	private void populatePerson(CaseFileForm form, PersonAssociation personAssociation, Person person)
	{
		Subject subject = form.getSubject();
		List<AddressHistory> addressHistoryArray = form.getAddressHistory();
		List<EmploymentHistory> employmentHistoryArray = form.getEmploymentHistory();
		
		personAssociation.setPersonType("Subject");
		
		person.setTitle(subject.getTitle());
		person.setGivenName(subject.getFirstName());
		person.setFamilyName(subject.getLastName());
		person.setDateOfBirth(subject.getDateOfBirth());
		
		person.setAddresses(new ArrayList<PostalAddress>());
		person.setOrganizations(new ArrayList<Organization>());
		
		if (null != addressHistoryArray && addressHistoryArray.size() > 0)
		{
			for (AddressHistory addressHistory : addressHistoryArray)
			{
				person.getAddresses().addAll(Arrays.asList(addressHistory.getLocation()));
			}
		}
		
		if (null != employmentHistoryArray && employmentHistoryArray.size() > 0)
		{
			for (EmploymentHistory employmentHistory : employmentHistoryArray)
			{
				person.getOrganizations().addAll(Arrays.asList(employmentHistory.getOrganization()));
			}
		}

		String employeeId = subject.getEmployeeId();
		String ssn = subject.getSocialSecurityNumber();
		
		populatePersonIdentification("EMPLOYEE_ID", employeeId, person);
		populatePersonIdentification("SSN", ssn, person);

	}
	
	private void populatePersonIdentification(String key, String value, Person person)
	{
		if ( value != null && !value.trim().isEmpty() )
		{
			boolean exists = false;
			if ( person.getPersonIdentification() != null )
			{
				for ( PersonIdentification pi : person.getPersonIdentification() )
				{
					if ( key.equals(pi.getIdentificationType())  )
					{
						pi.setIdentificationNumber(value);
						exists = true;
						break;
					}
				}
			}

			if ( ! exists )
			{
				if ( person.getPersonIdentification() == null )
				{
					person.setPersonIdentification(new ArrayList<PersonIdentification>());
				}
				
				PersonIdentification pi = new PersonIdentification();
				pi.setIdentificationNumber(value);
				pi.setIdentificationType(key);
				pi.setPerson(person);
				
				person.getPersonIdentification().add(pi);
			}
		}
	}
	
}