const axios = require('axios')
const userAgent = require('fake-useragent');

async function instagram(url) {
  try {
  const { data } = await axios.post('https://fastdl.app/c/',{
    url: url,
    lang_code: 'en',
    token: ''
  },{
    headers:{
      'Content-Type':"application/x-www-form-urlencoded; charset=UTF-8",
      'User-Agent': userAgent()
    }
  })
const parts = data.split('href="').slice(1); 
const res = parts.map(part => part.split('"')[0].replace(/amp;/g, ''));
return res
  } catch (e) {
  return 404
  }
}
// instagram('https://www.instagram.com/p/CZNzN0dgpsD/')
