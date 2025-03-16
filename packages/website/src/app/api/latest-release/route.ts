
export async function GET() {
  //TODO: Ask GitHub here and cache the version info.
  return Response.json({
    latest: "0.5.0-alpha.1",
    release_page: "https://github.com/astudentinearth/darkwrite/releases"
  })
}
