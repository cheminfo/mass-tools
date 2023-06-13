import { taxonomyTree } from '../taxonomyTree';

test('taxonomyTree', () => {
  const taxonomies = [
    {
      superKingdom: 'Eukaryota',
      kingdom: 'Fungi',
      phylum: 'Ascomycota',
      class: 'Saccharomycetes',
      order: 'Saccharomycetales',
      family: 'Debaryomycetaceae',
      genus: 'Candida',
      species: 'Candida albicans',
    },
    {
      superKingdom: 'bacteria',
      phylum: 'Apicomplexa',
      class: 'Aconoidasida',
      order: 'Haemosporida',
      family: 'Plasmodiidae',
      genus: 'Plasmodium',
      species: 'Plasmodium falciparum',
    },
    {
      superKingdom: 'Eukaryota',
      kingdom: 'Fungi',
      phylum: 'Ascomycota',
      class: 'Sordariomycetes',
      order: 'Hypocreales',
      family: 'Stachybotryaceae',
      genus: 'Stachybotrys',
      species: 'Stachybotrys chartarum',
    },
    {
      superKingdom: 'bacteria',
      kingdom: 'Fungi',
      phylum: 'Ascomycota',
      class: 'Sordariomycetes',
      order: 'Hypocreales',
      family: 'Stachybotryaceae',
      genus: 'Stachybotrys',
      species: 'Stachybotrys cylindrospora',
    },
  ];

  let tree = taxonomyTree(taxonomies);
  expect(tree[1].children).toHaveLength(2);
  expect(tree[1].children[0].name).toBe('Apicomplexa');
  expect(tree[1].children[1].name).toBe('Fungi');
  expect(JSON.stringify(tree, null, 2)).toMatchInlineSnapshot(`
    "[
      {
        \\"name\\": \\"Eukaryota\\",
        \\"rank\\": \\"superKingdom\\",
        \\"children\\": [
          {
            \\"name\\": \\"Fungi\\",
            \\"rank\\": \\"kingdom\\",
            \\"children\\": [
              {
                \\"name\\": \\"Ascomycota\\",
                \\"rank\\": \\"phylum\\",
                \\"children\\": [
                  {
                    \\"name\\": \\"Saccharomycetes\\",
                    \\"rank\\": \\"class\\",
                    \\"children\\": [
                      {
                        \\"name\\": \\"Saccharomycetales\\",
                        \\"rank\\": \\"order\\",
                        \\"children\\": [
                          {
                            \\"name\\": \\"Debaryomycetaceae\\",
                            \\"rank\\": \\"family\\",
                            \\"children\\": [
                              {
                                \\"name\\": \\"Candida\\",
                                \\"rank\\": \\"genus\\",
                                \\"children\\": [
                                  {
                                    \\"name\\": \\"Candida albicans\\",
                                    \\"rank\\": \\"species\\"
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    \\"name\\": \\"Sordariomycetes\\",
                    \\"rank\\": \\"class\\",
                    \\"children\\": [
                      {
                        \\"name\\": \\"Hypocreales\\",
                        \\"rank\\": \\"order\\",
                        \\"children\\": [
                          {
                            \\"name\\": \\"Stachybotryaceae\\",
                            \\"rank\\": \\"family\\",
                            \\"children\\": [
                              {
                                \\"name\\": \\"Stachybotrys\\",
                                \\"rank\\": \\"genus\\",
                                \\"children\\": [
                                  {
                                    \\"name\\": \\"Stachybotrys chartarum\\",
                                    \\"rank\\": \\"species\\"
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        \\"name\\": \\"bacteria\\",
        \\"rank\\": \\"superKingdom\\",
        \\"children\\": [
          {
            \\"name\\": \\"Apicomplexa\\",
            \\"rank\\": \\"phylum\\",
            \\"children\\": [
              {
                \\"name\\": \\"Aconoidasida\\",
                \\"rank\\": \\"class\\",
                \\"children\\": [
                  {
                    \\"name\\": \\"Haemosporida\\",
                    \\"rank\\": \\"order\\",
                    \\"children\\": [
                      {
                        \\"name\\": \\"Plasmodiidae\\",
                        \\"rank\\": \\"family\\",
                        \\"children\\": [
                          {
                            \\"name\\": \\"Plasmodium\\",
                            \\"rank\\": \\"genus\\",
                            \\"children\\": [
                              {
                                \\"name\\": \\"Plasmodium falciparum\\",
                                \\"rank\\": \\"species\\"
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            \\"name\\": \\"Fungi\\",
            \\"rank\\": \\"kingdom\\",
            \\"children\\": [
              {
                \\"name\\": \\"Ascomycota\\",
                \\"rank\\": \\"phylum\\",
                \\"children\\": [
                  {
                    \\"name\\": \\"Sordariomycetes\\",
                    \\"rank\\": \\"class\\",
                    \\"children\\": [
                      {
                        \\"name\\": \\"Hypocreales\\",
                        \\"rank\\": \\"order\\",
                        \\"children\\": [
                          {
                            \\"name\\": \\"Stachybotryaceae\\",
                            \\"rank\\": \\"family\\",
                            \\"children\\": [
                              {
                                \\"name\\": \\"Stachybotrys\\",
                                \\"rank\\": \\"genus\\",
                                \\"children\\": [
                                  {
                                    \\"name\\": \\"Stachybotrys cylindrospora\\",
                                    \\"rank\\": \\"species\\"
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]"
  `);
});
