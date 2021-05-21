/**
 * @example HTTP1.1 via undici
 * @description Before using script. Please add API_KEY on .env before run this script.
 */
require("dotenv").config()

// Dependency Section
import { request } from "undici"

/**
 * @function isValidJSONString
 * @description Validate JSON String format
 * @param json string
 * @returns boolean
 */
const isValidJSONString = (str) => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

/**
 * @function bufferToJSON
 * @description Convert stream Buffer data to JSON
 * @param response body form http request
 * @returns JSON Object
 */
const bufferToJSON = async (body) => {
  let jsonString = "1"
  for await (const chunk of body) {
    jsonString += String(chunk)
  }
  if (isValidJSONString(jsonString)) {
    const json = JSON.parse(jsonString)
    return json
  } else {
    return {
      error: {
        statusCode: 500,
        message: "Is not valid JSON String format.",
        data: jsonString
      }
    }
  }
}

/**
 * @function response
 * @description Response fallback on success and other status code
 * @param response form http request
 * @returns JSON Object
 */
const response = async (resp) => {
  // Destructure resp object
  const { statusCode, body } = resp

  // Convert body to json
  const data = await bufferToJSON(body)

  if (statusCode === 200) {
    // Debug via console.log
    console.log(data)

    return data
  } else {
    // Error body response format
    const temp = {
      error: {
        statusCode,
        data,
      },
    }

    // Debug via console.log
    console.log(temp)

    return temp
  }
}

/**
 * @function getMovie
 * @description get movie data form IMBD by IMBD ID
 * @params IMDB ID @String
 * @returns JSON Object
 */
const getMovie = async (i) => {
  // URL request construction
  const { API_KEY } = process.env
  const apikey = API_KEY // Generate API Key form http://www.omdbapi.com/apikey.aspx
  const url = `http://www.omdbapi.com/?i=${i}&apikey=${apikey}`

  // Make a get request
  const resp = await request(url)

  // Response Function
  return response(resp)
}

export default getMovie
