/**
 * 
 */
package com.armedia.acm.services.users.web.api.group;

import static org.easymock.EasyMock.capture;
import static org.easymock.EasyMock.expect;
import static org.junit.Assert.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import java.util.ArrayList;
import java.util.List;

import org.codehaus.jackson.map.ObjectMapper;
import org.easymock.Capture;
import org.easymock.EasyMockSupport;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.servlet.mvc.method.annotation.ExceptionHandlerExceptionResolver;

import com.armedia.acm.services.users.dao.group.AcmGroupDao;
import com.armedia.acm.services.users.model.AcmUser;
import com.armedia.acm.services.users.model.group.AcmGroup;

/**
 * @author riste.tutureski
 *
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {
        "classpath:/spring/spring-web-acm-web.xml",
        "classpath:/spring/spring-config-user-service-test-dummy-beans.xml"
})
public class RemoveMembersToGroupAPIControllerTest extends EasyMockSupport {

	private Logger LOG = LoggerFactory.getLogger(getClass());
	
	private MockMvc mockMvc;
	private RemoveMembersFromGroupAPIController unit;
	private Authentication mockAuthentication;
	private AcmGroupDao mockGroupDao;
	
	@Autowired
    private ExceptionHandlerExceptionResolver exceptionResolver;
	
	@Before
    public void setUp() throws Exception
    {
		setUnit(new RemoveMembersFromGroupAPIController());
		setMockMvc(MockMvcBuilders.standaloneSetup(getUnit()).setHandlerExceptionResolvers(getExceptionResolver()).build());
		setMockAuthentication(createMock(Authentication.class));	
		setMockGroupDao(createMock(AcmGroupDao.class));
		
		getUnit().setGroupDao(getMockGroupDao());
    }
	
	@Test
    public void removeMembersFromGroupTest() throws Exception
    {   
		AcmGroup group = new AcmGroup();
		
		group.setName("Group Name");
		group.setDescription("Group Description");
		group.setType("Group Type");
		group.setStatus("Group Status");
		
		AcmUser user1 = new AcmUser();
		user1.setUserId("test-user-1");
		user1.setUserDirectoryName("Test Directory Name 1");
		user1.setUserState("TEST");
		user1.setFirstName("First Name 1");
		user1.setLastName("Last Name 1");
		
		AcmUser user2 = new AcmUser();
		user2.setUserId("test-user-2");
		user2.setUserDirectoryName("Test Directory Name 2");
		user2.setUserState("TEST");
		user2.setFirstName("First Name 2");
		user2.setLastName("Last Name 2");
		
		List<AcmUser> members = new ArrayList<AcmUser>();
		members.add(user1);
		members.add(user2);
		group.setMembers(members);
		
		List<AcmUser> membersToRemove = new ArrayList<AcmUser>();
		membersToRemove.add(user1);
		
		ObjectMapper objectMapper = new ObjectMapper();
		String membersToRemoveAsJson = objectMapper.writeValueAsString(membersToRemove);
		
		LOG.debug("Input JSON: " + membersToRemoveAsJson);
		
		Capture<AcmGroup> found = new Capture<AcmGroup>();
		
		expect(getMockGroupDao().findByName(group.getName())).andReturn(group);
		expect(getMockGroupDao().save(capture(found))).andReturn(group);
		expect(getMockAuthentication().getName()).andReturn("user");
		
		replayAll();
		
		MvcResult result = getMockMvc().perform(
	            post("/api/v1/users/group/" + group.getName() + "/members/remove/")
	                    .accept(MediaType.parseMediaType("application/json;charset=UTF-8"))
	                    .contentType(MediaType.APPLICATION_JSON)
	                    .principal(getMockAuthentication())
	                    .content(membersToRemoveAsJson))
	                .andReturn();
		
		LOG.info("Results: " + result.getResponse().getContentAsString());
		
		verifyAll();
		
		AcmGroup resultGroup = objectMapper.readValue(result.getResponse().getContentAsString(), AcmGroup.class);
		
		assertEquals(1, resultGroup.getMembers().size());
		assertEquals(members.get(1).getUserId(), resultGroup.getMembers().get(0).getUserId());
		assertEquals(HttpStatus.OK.value(), result.getResponse().getStatus());
    }

	public MockMvc getMockMvc() {
		return mockMvc;
	}

	public void setMockMvc(MockMvc mockMvc) {
		this.mockMvc = mockMvc;
	}

	public RemoveMembersFromGroupAPIController getUnit() {
		return unit;
	}

	public void setUnit(RemoveMembersFromGroupAPIController unit) {
		this.unit = unit;
	}

	public Authentication getMockAuthentication() {
		return mockAuthentication;
	}

	public void setMockAuthentication(Authentication mockAuthentication) {
		this.mockAuthentication = mockAuthentication;
	}

	public ExceptionHandlerExceptionResolver getExceptionResolver() {
		return exceptionResolver;
	}

	public void setExceptionResolver(
			ExceptionHandlerExceptionResolver exceptionResolver) {
		this.exceptionResolver = exceptionResolver;
	}

	public AcmGroupDao getMockGroupDao() {
		return mockGroupDao;
	}

	public void setMockGroupDao(AcmGroupDao mockGroupDao) {
		this.mockGroupDao = mockGroupDao;
	}
	
}