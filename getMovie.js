/**
 * @example HTTP1.1 via undici
 * @description Before using script. Please insert apiKey before run this script.
 */

// Dependency Section
import { request } from "undici"

/**
 * @function bufferToJSON
 * @description Convert stream Buffer data to JSON
 * @returns JSON Object
 */
const bufferToJSON = async (body) => {
  let jsonString = ""
  for await (const chunk of body) {
    jsonString += String(chunk)
  }
  const json = JSON.parse(jsonString)
  return json
}

/**
 * @function response
 * @description Response fallback on success and other status code
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
  const apikey = "" // Generate API Key form http://www.omdbapi.com/apikey.aspx
  const url = `http://www.omdbapi.com/?i=${i}&apikey=${apikey}`

  // Make a get request
  const resp = await request(url)

  // Response Function
  response(resp)
}

/**
 * Execute Function
 */
getMovie("tt0120591")
