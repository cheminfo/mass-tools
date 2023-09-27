import { readFile, stat } from 'fs/promises';
import { join } from 'path';

import { rest } from 'msw';
import { setupServer } from 'msw/node';

export const server = setupServer(
  rest.get(`http://localhost/data*`, async (req, res, ctx) => {
    const pathname = join(__dirname, req.url.pathname);
    const pathnameStat = await stat(pathname);
    if (pathnameStat.isFile()) {
      const data = await readFile(pathname);
      const jsonContent = JSON.parse(data.toString());
      if (req.url.pathname.includes('activesOrNaturals')) {
        return res(ctx.json({ data: jsonContent }));
      } else if (req.url.pathname.includes('compoundsFromMF')) {
        const mf = req.url.searchParams.get('mf');
        const filteredContent = jsonContent.data.filter(
          (item) => item.data.mf === mf,
        );
        return res(ctx.json({ data: filteredContent }));
      } else if (req.url.pathname.includes('activeOrNaturalDetails')) {
        const id = req.url.searchParams.get('id');
        const fields = req.url.searchParams.get('fields');
        const fieldsArray = fields?.split(',');
        const filteredContent = jsonContent.filter(
          (item) => item.data._id === id,
        )[0].data;

        const filteredItem = {};

        fieldsArray?.forEach((field) => {
          let dataFields = field.split('.');
          if (dataFields.length === 1) {
            filteredItem[field] = filteredContent[field];
          } else {
            filteredItem[dataFields[0]][dataFields[1]] =
              filteredContent[dataFields[0]][dataFields[1]];
          }
        });

        return res(ctx.json({ _id: id, data: filteredItem }));
      }
    } else {
      throw new Error(`unknown path: ${pathname}`);
    }
  }),
);
