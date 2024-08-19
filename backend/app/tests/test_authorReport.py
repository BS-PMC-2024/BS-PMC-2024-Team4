import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
from selenium import webdriver

@pytest.fixture
def browser():
    # Initialize the WebDriver (e.g., Chrome)
    driver = webdriver.Chrome()
    yield driver
    driver.quit()

def test_authorities_report_submission(browser):
    # Convert the relative path to an absolute path
    file_path = os.path.abspath("../backend/app/main/templates/HomePage.html")
    browser.get(f"file:///{file_path}")

    authorities_tab_button = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.ID, "AuthoritiesReportButton"))
    )
    authorities_tab_button.click()

    # Wait until the AuthoritiesReport div is visible
    WebDriverWait(browser, 10).until(
        EC.visibility_of_element_located((By.ID, "AuthoritiesReport"))
    )

    # Now locate the input fields inside the AuthoritiesReport div
    subject_input = browser.find_element(By.ID, "notificationTitle")
    location_input = browser.find_element(By.ID, "notificationTitle")
    report_textarea = browser.find_element(By.ID, "notificationMessage")
    submit_button = browser.find_element(By.ID, "authorb")

    # Fill in the form
    subject_input.send_keys("Test Subject")
    location_input.send_keys("Test Location")
    report_textarea.send_keys("This is a test report.")

    # Submit the form
    submit_button.click()

    # Wait for alert and confirm it
    alert = browser.switch_to.alert
    assert "Your report has been submitted successfully!" in alert.text
    alert.accept()

    # Check if the AuthoritiesReport div is hidden again
    WebDriverWait(browser, 10).until(
        EC.invisibility_of_element_located((By.ID, "AuthoritiesReport"))
    )
    assert browser.find_element(By.ID, "AuthoritiesReport").is_displayed() == False
