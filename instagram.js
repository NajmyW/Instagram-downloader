const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

async function getToken() {
  const { data } = await axios.get("https://storysaver.to/en")

  // Modify regex patterns for flexibility and ensure capturing
  const kExpMatch = /k_exp\s*=\s*"(\d+)"/.exec(data);
  const kTokenMatch = /k_token\s*=\s*"([a-f0-9]+)"/.exec(data);

  // Retrieve the values
  const k_exp = kExpMatch ? kExpMatch[1] : null;
  const k_token = kTokenMatch ? kTokenMatch[1] : null;

  console.log("k_exp:", k_exp);
  console.log("k_token:", k_token);
  return {
    k_exp: k_exp,
    k_token: k_token,
  }
}

async function instagram(url) {
  try {
    const form = new FormData();
    const { k_exp, k_token } = await getToken();

    form.append("url", url);
    form.append("k_token", k_token);
    form.append("k_exp", k_exp);
    form.append("q", url); // Check if this URL is correct
    form.append("t", "media");
    form.append("lang", "en");
    form.append("v", "v2");

    // Post request with form data and appropriate headers
    const response = await axios.post(
      "https://storysaver.to/api/ajaxSearch",
      form,
      { headers: form.getHeaders ? form.getHeaders() : {} }
    );

    // console.log(response.data.data);
    const $ = cheerio.load(response.data.data);

    // Find all <a> tags and extract href attributes
    const result = [];
    $('a').each((index, element) => {
      const href = $(element).attr('href');
      if (href) {
        if (!href.includes("snapcdn")) return
        result.push(href);
      }
    });

    return result
  } catch (error) {
    console.error("Error fetching Instagram data:", error.message);
    return error.message
  }
}

// instagram("https://www.instagram.com/p/DAudAbaRrPZ/")
