import pytest
from playwright.sync_api import Browser, BrowserContext

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args, base_url):
    return {
        **browser_context_args,
        "base_url": "https://bookamore.alt-web.biz.ua", 
        "viewport": {"width": 1920, "height": 1080}
    }

@pytest.fixture
def auth_session(page):
   
    page.goto("/sign-in")
    page.fill("input[name='email']", "john.doe@example.com")
    page.fill("input[name='password']", "myPassword123")
    page.click("button[type='Log In']")
    
    page.wait_for_url("**/dashboard")
    
    return page

@pytest.fixture(scope="session")
def browser_type_launch_args(browser_type_launch_args):
    return {
        **browser_type_launch_args,
        "headless": False,  # Завжди запускати з вікном
        "slow_mo": 500,     # Невелика затримка, щоб бачити дії
    }
  
