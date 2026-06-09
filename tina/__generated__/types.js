export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const BlogPartsFragmentDoc = gql`
    fragment BlogParts on Blog {
  __typename
  title
  description
  pubDate
  heroImage
  body
}
    `;
export const ShayariPartsFragmentDoc = gql`
    fragment ShayariParts on Shayari {
  __typename
  title
  description
  pubDate
  heroImage
  body
}
    `;
export const QuotesPartsFragmentDoc = gql`
    fragment QuotesParts on Quotes {
  __typename
  title
  description
  pubDate
  heroImage
  body
}
    `;
export const ToolsPartsFragmentDoc = gql`
    fragment ToolsParts on Tools {
  __typename
  title
  description
  pubDate
  heroImage
  body
}
    `;
export const PromptsPartsFragmentDoc = gql`
    fragment PromptsParts on Prompts {
  __typename
  title
  description
  pubDate
  heroImage
  body
}
    `;
export const StotrasPartsFragmentDoc = gql`
    fragment StotrasParts on Stotras {
  __typename
  title
  description
  pubDate
  heroImage
  body
}
    `;
export const BlogDocument = gql`
    query blog($relativePath: String!) {
  blog(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...BlogParts
  }
}
    ${BlogPartsFragmentDoc}`;
export const BlogConnectionDocument = gql`
    query blogConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: BlogFilter) {
  blogConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...BlogParts
      }
    }
  }
}
    ${BlogPartsFragmentDoc}`;
export const ShayariDocument = gql`
    query shayari($relativePath: String!) {
  shayari(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...ShayariParts
  }
}
    ${ShayariPartsFragmentDoc}`;
export const ShayariConnectionDocument = gql`
    query shayariConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ShayariFilter) {
  shayariConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...ShayariParts
      }
    }
  }
}
    ${ShayariPartsFragmentDoc}`;
export const QuotesDocument = gql`
    query quotes($relativePath: String!) {
  quotes(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...QuotesParts
  }
}
    ${QuotesPartsFragmentDoc}`;
export const QuotesConnectionDocument = gql`
    query quotesConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: QuotesFilter) {
  quotesConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...QuotesParts
      }
    }
  }
}
    ${QuotesPartsFragmentDoc}`;
export const ToolsDocument = gql`
    query tools($relativePath: String!) {
  tools(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...ToolsParts
  }
}
    ${ToolsPartsFragmentDoc}`;
export const ToolsConnectionDocument = gql`
    query toolsConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ToolsFilter) {
  toolsConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...ToolsParts
      }
    }
  }
}
    ${ToolsPartsFragmentDoc}`;
export const PromptsDocument = gql`
    query prompts($relativePath: String!) {
  prompts(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...PromptsParts
  }
}
    ${PromptsPartsFragmentDoc}`;
export const PromptsConnectionDocument = gql`
    query promptsConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: PromptsFilter) {
  promptsConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...PromptsParts
      }
    }
  }
}
    ${PromptsPartsFragmentDoc}`;
export const StotrasDocument = gql`
    query stotras($relativePath: String!) {
  stotras(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...StotrasParts
  }
}
    ${StotrasPartsFragmentDoc}`;
export const StotrasConnectionDocument = gql`
    query stotrasConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: StotrasFilter) {
  stotrasConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...StotrasParts
      }
    }
  }
}
    ${StotrasPartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    blog(variables, options) {
      return requester(BlogDocument, variables, options);
    },
    blogConnection(variables, options) {
      return requester(BlogConnectionDocument, variables, options);
    },
    shayari(variables, options) {
      return requester(ShayariDocument, variables, options);
    },
    shayariConnection(variables, options) {
      return requester(ShayariConnectionDocument, variables, options);
    },
    quotes(variables, options) {
      return requester(QuotesDocument, variables, options);
    },
    quotesConnection(variables, options) {
      return requester(QuotesConnectionDocument, variables, options);
    },
    tools(variables, options) {
      return requester(ToolsDocument, variables, options);
    },
    toolsConnection(variables, options) {
      return requester(ToolsConnectionDocument, variables, options);
    },
    prompts(variables, options) {
      return requester(PromptsDocument, variables, options);
    },
    promptsConnection(variables, options) {
      return requester(PromptsConnectionDocument, variables, options);
    },
    stotras(variables, options) {
      return requester(StotrasDocument, variables, options);
    },
    stotrasConnection(variables, options) {
      return requester(StotrasConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "https://content.tinajs.io/2.4/content/d3cb431b-ec2b-4028-aeca-786050418f67/github/main",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
