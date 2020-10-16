import qs from "qs";

const Router = require("./router");
const BASE_URL = "https://campuswire.com/c/G87498D9F/feed/";

/**
 * Example of how router can be used in an application
 *  */
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handler(request) {
  const init = {
    headers: { "content-type": "application/json" },
  };

  const req = await request.text();
  const params = qs.parse(req);

  // clean up input
  const input = params["text"].trim();
  const clean = input.replace(/[^\d\s]/gi, "");
  const num = clean.split(" ")[0];

  // error handling
  let body = JSON.stringify({
    response_type: "ephemeral",
    text: "Sorry, that didn't work :( Please try again.",
  });

  if (!!num)
    body = JSON.stringify({
      response_type: "in_channel",
      text: `${BASE_URL}${num}`,
    });

  return new Response(body, init);
}

async function handleRequest(request) {
  const router = new Router();

  router.post("/campuswire", (request) => handler(request));

  let response = await router.route(request);
  if (!response) {
    response = new Response("Not found", { status: 404 });
  }
  return response;
}
