var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder().build();
var ROOT_URL = 'http://localhost:3000/';
var CLICK_DELAY = 500;

var find = function (condition, timeout, message) {
  return driver.findElement(condition);
};

var waitFor = function (condition, timeout, message) {
  driver.wait(until.elementLocated(condition), timeout, message);
  return find(condition, timeout, message);
};

var listingPage = function (url, title) {
  driver.get(url);
  waitFor(By.xpath("//h1[text()='Listing " + title + "']"), 3000, title + ' Title not found');
  for(var i = 2; i < arguments.length; i++) {
    waitFor(By.xpath('//th[text()="' + arguments[i] + '"]'), 3000, arguments[i] + ' Heading not found');
  }
}

var findElementClass = function (element, clazz) {
  waitFor(By.xpath(
    "//" + element + "[contains(@class, '" + clazz + "')]"), 
    3000, element + " element with " + clazz + " class not found");
}

var findNotElementClass = function (element, clazz) {
  driver.findElements(By.xpath("//" + element + "[contains(@class, '" + clazz + "')]")).then(
    function (elements) {
      if (elements.length > 0) {
        throw element + " element with " + clazz + " class found";
      }
    }
  );
}

var clickLink = function (link, title) {
  driver.sleep(CLICK_DELAY);
  waitFor(By.xpath('(//a[text()="' + link + '"])[last()]'), 3000, link + ' Link not found').click();
  if (title) {
    waitFor(By.xpath('//h1[text()="' + title + '"]'), 3000, title + ' Title not found');
  }
}

var fillForm = function () {
  for(var i = 0; i < arguments.length; i++) { 
    var input = find(By.id(arguments[i++]));
    input.clear();
    input.sendKeys(arguments[i]);
  }
}

var clickButton = function(label) {
  find(By.xpath('//input[@value="' + label + '"]')).click();
  driver.sleep(CLICK_DELAY);
}

var back = function () {
  driver.sleep(CLICK_DELAY);
  find(By.xpath('//a[text()="Back"]')).click();
  driver.sleep(CLICK_DELAY);
}


listingPage(ROOT_URL + 'bugs', "Bugs");
clickLink('New Bug', 'New Bug');
fillForm("bug_code", "1", "bug_product", "Product 1", "bug_keywords", "Keyword 1", "bug_tags", "Tag 1");
clickButton('Create Bug');
findElementClass("span", "w3-tag w3-green");
findElementClass("span", "w3-tag w3-blue");
findNotElementClass("span", "w3-tag w3-red");

listingPage(ROOT_URL + 'issues', "Issues");
clickLink('New Issue', 'New Issue');
fillForm("issue_code", "123", "issue_project", "Project 1", "issue_labels", "Label 1");
clickButton('Create Issue');
findNotElementClass("span", "w3-tag w3-green");
findNotElementClass("span", "w3-tag w3-blue");
findElementClass("span", "w3-tag w3-red");

listingPage(ROOT_URL + 'products', "Products");
clickLink('New Product', 'New Product');
fillForm("product_code", "111", "product_name", "Product 1", "product_tags", "Tag 2");
clickButton('Create Product');
findElementClass("span", "w3-tag w3-green");
findNotElementClass("span", "w3-tag w3-blue");
findNotElementClass("span", "w3-tag w3-red");

listingPage(ROOT_URL + 'projects', "Projects");
clickLink('New Project', 'New Project');
fillForm("project_identifier", "111", "project_name", "Project 1");
clickButton('Create Project');
findNotElementClass("span", "w3-tag w3-green");
findNotElementClass("span", "w3-tag w3-blue");
findNotElementClass("span", "w3-tag w3-red");

driver.quit();
