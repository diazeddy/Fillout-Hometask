// external dependencies
import express from "express";
// internal dependencies
import {
  fetchAllResponses,
  fetchResponses,
  filterResponsesWithCustomParams,
} from "./utils/api/apiUtils";
import { MAX_PAGE_SIZE, NO_RESPONSE_FOUND, PORT } from "./utils/constants";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
  res.send("Hello, World!");
});

app.get("/:formId/filteredResponses", async (req, res) => {
  const queryParams = req.query;
  const formId = req.params.formId;

  if (!queryParams.filters) {
    const { responses } = await fetchResponses(formId, queryParams);
    // no custom filters - just return original responses from fillout API
    res.status(200).send(responses);
  } else {
    // detach pagination
    const offsetParam = parseInt((req.query.offset as string) ?? 0);
    const limitParam = parseInt((req.query.limit as string) ?? MAX_PAGE_SIZE);

    delete queryParams.offset;
    delete queryParams.limit;

    const responses = await fetchAllResponses(formId, {
      queryParams,
    });
    const customFilters = JSON.parse(
      decodeURIComponent(queryParams.filters as string)
    );

    const filteredResponses = filterResponsesWithCustomParams(
      responses,
      customFilters
    );

    const totalResponses = filteredResponses.length;
    const pageCount = Math.ceil(totalResponses / limitParam);

    if (filteredResponses.length)
      res.status(200).send({
        responses: filteredResponses.slice(
          offsetParam,
          offsetParam + limitParam
        ),
        totalResponses,
        pageCount,
      });
    else res.status(400).send({ message: NO_RESPONSE_FOUND });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
