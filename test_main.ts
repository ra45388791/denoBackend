// import * as fs from '@std/fs'
// import * as path from '@std/path'

export function add(a: number, b: number): number {
  return a + b;
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("Add 2 + 3 =", add(2, 3));
}
console.log(Deno.args[1]);

const handler = (req: Request) => {
  console.log(req.method);
  console.log(req.url);
  console.log(req.headers);


  switch (req.method) {
    case "GET":
      console.log("是 GET");
      if (new URL(req.url).pathname === "/testapi") {
        console.log("打到 testapi");
      }
      break;
    case "POST":
      console.log("是 POST");
      break
  }


  const body = JSON.stringify({ message: "NOT FOUND" });
  return new Response(body, {
    status: 404,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
};


Deno.serve({ port: 3000 }, handler);


