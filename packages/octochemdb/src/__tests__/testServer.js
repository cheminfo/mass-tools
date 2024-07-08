import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

import { http } from 'msw';
import { setupServer } from 'msw/node';

export const server = setupServer(
  http.get(`http://localhost/data*`, async ({ request }) => {
    const url = new URL(request.url);
    const pathname = path.join(__dirname, url.pathname);
    const pathnameStat = await stat(pathname);
    if (pathnameStat.isFile()) {
      const data = await readFile(pathname);
      const jsonContent = JSON.parse(data.toString());
      if (url.pathname.includes('activesOrNaturals')) {
        if (url.searchParams.get('noStereoTautomerID')) {
          let filteredContent = jsonContent.filter(
            (item) => item._id === url.searchParams.get('noStereoTautomerID'),
          );
          return new Response(JSON.stringify({ data: filteredContent }));
        }

        return new Response(JSON.stringify({ data: jsonContent }));
      } else if (url.pathname.includes('compoundsFromMF')) {
        const mf = url.searchParams.get('mf');
        const filteredContent = jsonContent.data.filter(
          (item) => item.data.mf === mf,
        );
        return new Response(JSON.stringify({ data: filteredContent }));
      } else if (url.pathname.includes('activeOrNaturalDetails')) {
        const id = url.searchParams.get('id');
        const fields = url.searchParams.get('fields');
        const fieldsArray = fields?.split(',');
        const filteredContent = jsonContent.find(
          (item) => item.data._id === id,
        ).data;

        const filteredItem = {};

        if (fieldsArray) {
          for (const field of fieldsArray) {
            let dataFields = field.split('.');
            if (dataFields.length === 1) {
              filteredItem[field] = filteredContent[field];
            } else {
              filteredItem[dataFields[0]][dataFields[1]] =
                filteredContent[dataFields[0]][dataFields[1]];
            }
          }
        }

        return new Response(JSON.stringify({ _id: id, data: filteredItem }));
      }
    } else {
      throw new Error(`unknown path: ${pathname}`);
    }
  }),
);
