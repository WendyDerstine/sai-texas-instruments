import {
  Text,
  RichText,
  Field,
  useSitecore,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { JSX } from 'react';

type ContentBlockProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    content: Field<string>;
  };
};

/**
 * A simple Content Block component, with a heading and rich text block.
 * This is the most basic building block of a content site, and the most basic
 * Content SDK component that's useful.
 */
const ContentBlock = ({ fields }: ContentBlockProps): JSX.Element => {
  const { page } = useSitecore();
  const editable = page?.mode?.isEditing ?? false;
  return (
    <div className="contentBlock">
      <Text tag="h2" className="contentTitle" field={fields.heading} editable={editable} />
      <RichText className="contentDescription" field={fields.content} editable={editable} />
    </div>
  );
};

export default withDatasourceCheck()<ContentBlockProps>(ContentBlock);
