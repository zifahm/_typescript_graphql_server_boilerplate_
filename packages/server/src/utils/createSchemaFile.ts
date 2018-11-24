import * as fs from "fs";
import * as glue from "schemaglue";

const { schema } = glue("src/modules", { mode: "ts" });

fs.writeFile("schema.graphql", schema, "utf-8", err => {
  console.log(err);
});
