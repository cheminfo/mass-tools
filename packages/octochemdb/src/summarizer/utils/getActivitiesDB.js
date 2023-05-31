import { create, insert } from '@orama/orama';

export async function getActivitiesDB(activities, options = {}) {
  const { queryFields = ['assay'] } = options;
  const activitiesDB = await create({
    schema: {
      $id: 'string',
      ...(queryFields.includes('assay') ? { assay: 'string' } : null),
    },
  });
  for (const activity of activities) {
    let assay = {
      $id: activity.$id,
    };

    assay.assay = activity.data.assay;
    await insert(activitiesDB, assay);
  }
  return activitiesDB;
}
