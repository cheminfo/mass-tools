/**
 * @description This function normalizes the activities of an entry of ActivesOrNaturals collection.
 * @param {Object} activeOrNatural - an entry of ActivesOrNaturals collection
 * @returns - ActiveOrNatural entry with normalized activities
 */
export function normalizeActivities(activeOrNatural) {
  activeOrNatural = { ...activeOrNatural };
  let activities = [];
  for (let activity of activeOrNatural.data.activities) {
    if (activity?.data?.activities !== undefined) {
      for (let activityEntry of activity.data.activities) {
        let normalizedActivity = {
          $ref: activity.$ref,
          $id: activity.$id,
          data: {
            assay: activityEntry.assay,
            targetTaxonomies: activityEntry.targetTaxonomies,
            ocl: activity.data.ocl,
          },
          url: activity.url,
        };
        activities.push(normalizedActivity);
      }
    } else {
      activities.push(activity);
    }
  }
  activeOrNatural.data.activities = activities;
  return activeOrNatural;
}
