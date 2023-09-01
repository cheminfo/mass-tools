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
      if (req.url.pathname.includes('massBank')) {
        // @ts-ignore
        const searchMasses = req.url.searchParams
          .get('masses')
          .split(',')
          .map((mass) => Number(mass));
        // convert to number
        const firstSetIDs = [
          'MSBNK-Fac_Eng_Univ_Tokyo-JP008349',
          'MSBNK-Fac_Eng_Univ_Tokyo-JP009511',
          'MSBNK-Fac_Eng_Univ_Tokyo-JP004561',
          'MSBNK-Fac_Eng_Univ_Tokyo-JP008348',
          'MSBNK-Fac_Eng_Univ_Tokyo-JP008350',
          'MSBNK-Fac_Eng_Univ_Tokyo-JP005763',
          'MSBNK-Fac_Eng_Univ_Tokyo-JP005767',
          'MSBNK-Fac_Eng_Univ_Tokyo-JP009510',
        ];
        const secondSetIDs = [
          'MSBNK-Fac_Eng_Univ_Tokyo-JP003435',
          'MSBNK-Fac_Eng_Univ_Tokyo-JP010431',
          'MSBNK-Fac_Eng_Univ_Tokyo-JP005785',
          'MSBNK-Fac_Eng_Univ_Tokyo-JP003857',
          'MSBNK-Fac_Eng_Univ_Tokyo-JP010744',
          'MSBNK-Fac_Eng_Univ_Tokyo-JP005780',
          'MSBNK-Kazusa-KZ000257',
          'MSBNK-Kazusa-KZ000134',
          'MSBNK-Kazusa-KZ000022',
          'MSBNK-Kazusa-KZ000135',
          'MSBNK-MSSJ-MSJ01070',
          'MSBNK-Osaka_Univ-OUF01014',
          'MSBNK-Osaka_Univ-OUF00366',
          'MSBNK-Osaka_Univ-OUF00323',
          'MSBNK-Waters-WA001055',
        ];

        if (Math.round(searchMasses[0] * 1000) / 1000 === 84.005) {
          // remove from jsonContent.data all entries that are not in firstSetIDs
          const filteredContent = jsonContent.data.filter(
            (item) => firstSetIDs.indexOf(item._id) !== -1,
          );

          return res(ctx.json({ data: filteredContent }));
        } else if (Math.round(searchMasses[0] * 1000) / 1000 === 114.016) {
          const filteredContent = jsonContent.data.filter(
            (item) => secondSetIDs.indexOf(item._id) !== -1,
          );
          return res(ctx.json({ data: filteredContent }));
        }
        //   return res(ctx.json({ data: jsonContent.data }));
      } else if (req.url.pathname.includes('gnps')) {
        // @ts-ignore
        const searchMasses = req.url.searchParams
          .get('masses')
          .split(',')
          .map((mass) => Number(mass));
        // convert to number
        const firstSetIDs = [
          'CCMSLIB00010118366',

          'CCMSLIB00010118369',

          'CCMSLIB00000086120',

          'CCMSLIB00010108912',
        ];
        const secondSetIDs = ['CCMSLIB00006418819'];

        if (Math.round(searchMasses[0] * 1000) / 1000 === 84.005) {
          // remove from jsonContent.data all entries that are not in firstSetIDs
          const filteredContent = jsonContent.data.filter(
            (item) => secondSetIDs.indexOf(item._id) !== -1,
          );

          return res(ctx.json({ data: filteredContent }));
        } else if (Math.round(searchMasses[0] * 1000) / 1000 === 114.016) {
          const filteredContent = jsonContent.data.filter(
            (item) => firstSetIDs.indexOf(item._id) !== -1,
          );
          return res(ctx.json({ data: filteredContent }));
        }
        //   return res(ctx.json({ data: jsonContent.data }));
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
