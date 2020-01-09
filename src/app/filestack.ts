import * as filestack from "filestack-js"

const client = filestack.init(process.env.REACT_APP_FILESTACK_API_KEY || "")

export default client
