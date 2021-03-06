const { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } = process.env;

const siteTitle = 'maiyama';
const siteDescription = 'about @maiyama'
const siteUrl = "https://muiscript.tokyo";

module.exports = {
    siteMetadata: {
        title: siteTitle,
        description: siteDescription,
        siteUrl,
    },
    plugins: [
        'gatsby-plugin-offline',
        {
            resolve: 'gatsby-source-contentful',
            options: {
                spaceId: CONTENTFUL_SPACE_ID,
                accessToken: CONTENTFUL_ACCESS_TOKEN,
            }
        },
        'gatsby-transformer-remark',
        {
            resolve: 'gatsby-plugin-google-fonts',
            options: {
                fonts: [
                    'M PLUS Rounded 1c\:regular,bold',
                    'Source Code Pro\:regular',
                ]
            }
        },
        'gatsby-plugin-react-helmet',
        {
            resolve: 'gatsby-plugin-feed',
            options: {
                query: `{
                  site {
                    siteMetadata {
                      siteUrl
                      title
                      description
                    }
                  }
                }`,
                feeds: [
                    {
                        output: '/diary/rss.xml',
                        serialize: ({ query: { site, allContentfulDiary } }) => {
                            return allContentfulDiary.edges.map(({ node }) => {
                                const formattedDate = node.date.replace(/-/g, '');
                                return {
                                    url: `${site.siteMetadata.siteUrl}/diary/${formattedDate}`,
                                    guid: `${site.siteMetadata.siteUrl}/diary/${formattedDate}`,
                                    date: node.date,
                                    title: formattedDate,
                                    description: node.content.childMarkdownRemark.html,
                                }
                            })
                        },
                        query: `{
                          site {
                            siteMetadata {
                              siteUrl
                              title
                              description
                            }
                          }
                          allContentfulDiary(
                            limit: 1000,
                            sort: { fields: [date], order: DESC },
                          ) {
                            edges {
                              node {
                                date
                                content {
                                  childMarkdownRemark {
                                    html
                                  }
                                }
                              }
                            }
                          }
                        }
                        `,
                    },
                    {
                        title: 'mui blog',
                        output: '/blog/rss.xml',
                        serialize: ({ query: { site, allContentfulBlog } }) => {
                            return allContentfulBlog.edges.map(({ node }) => {
                                return {
                                    url: `${site.siteMetadata.siteUrl}/blog/${node.id}`,
                                    guid: `${site.siteMetadata.siteUrl}/blog/${node.id}`,
                                    date: node.postedAt,
                                    title: node.title,
                                    description: node.body.childMarkdownRemark.html,
                                }
                            })
                        },
                        query: `{
                          site {
                            siteMetadata {
                              siteUrl
                              title
                              description
                            }
                          }
                          allContentfulBlog(
                           limit: 1000,
                           sort: { fields: [postedAt], order: DESC }
                          ) {
                            edges {
                              node {
                                id
                                title
                                postedAt
                                body {
                                  childMarkdownRemark {
                                    html
                                  }
                                }
                              }
                            }
                          }
                        }
                        `,
                    },
                ]
            }
        },
    ]
};
