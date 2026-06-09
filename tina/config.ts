import { defineConfig } from 'tinacms';

const branch =
  process.env.GITHUB_BRANCH || process.env.HEAD || 'main';

// Shared fields for all collections
const baseFields = [
  {
    type: 'string' as const,
    name: 'title',
    label: 'Title',
    isTitle: true,
    required: true,
  },
  {
    type: 'string' as const,
    name: 'description',
    label: 'Description',
    ui: { component: 'textarea' },
    required: true,
  },
  {
    type: 'datetime' as const,
    name: 'pubDate',
    label: 'Publish Date',
  },
  {
    type: 'string' as const,
    name: 'heroImage',
    label: 'Hero Image URL',
  },
  {
    type: 'rich-text' as const,
    name: 'body',
    label: 'Body',
    isBody: true,
  },
];

export default defineConfig({
  branch,
  clientId: 'd3cb431b-ec2b-4028-aeca-786050418f67',
  token: '8d476b733bef75ff66367e2f45d42430b85f6e73',

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },

  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      {
        name: 'blog',
        label: 'Blog Posts',
        path: 'src/content/blog',
        format: 'md',
        fields: [
          ...baseFields.slice(0, 2),
          {
            type: 'datetime' as const,
            name: 'pubDate',
            label: 'Publish Date',
            required: true,
          },
          ...baseFields.slice(3),
        ],
      },
      {
        name: 'shayari',
        label: 'Shayari',
        path: 'src/content/shayari',
        format: 'md',
        fields: baseFields,
      },
      {
        name: 'quotes',
        label: 'Quotes',
        path: 'src/content/quotes',
        format: 'md',
        fields: baseFields,
      },
      {
        name: 'tools',
        label: 'SEO Tools',
        path: 'src/content/tools',
        format: 'md',
        fields: baseFields,
      },
      {
        name: 'prompts',
        label: 'Devotional Prompts',
        path: 'src/content/prompts',
        format: 'md',
        fields: baseFields,
      },
      {
        name: 'stotras',
        label: 'Stotras',
        path: 'src/content/stotras',
        format: 'md',
        fields: [
          ...baseFields.slice(0, 2),
          {
            type: 'datetime' as const,
            name: 'pubDate',
            label: 'Publish Date',
            required: true,
          },
          ...baseFields.slice(3),
        ],
      },
    ],
  },
});
