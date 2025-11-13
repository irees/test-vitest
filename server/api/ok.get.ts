interface Response {
    success: boolean
}

export default defineEventHandler(async (_event): Promise<Response> => {
  return { success: true }
})
