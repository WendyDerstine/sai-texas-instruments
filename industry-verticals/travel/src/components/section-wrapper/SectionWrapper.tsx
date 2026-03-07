import { ComponentProps } from '@/lib/component-props';
import {
  Field,
  LinkField,
  Placeholder,
  Text,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';

interface Fields {
  Title: Field<string>;
  Description: Field<string>;
  Link: LinkField;
}

interface SectionWrapperProps extends ComponentProps {
  fields: Fields;
}

export const Default = ({ params, fields, rendering }: SectionWrapperProps) => {
  const { page } = useSitecore();
  const editable = page?.mode?.isEditing ?? false;
  const { styles, RenderingIdentifier: id } = params;
  const componentPlaceholderKey = `section-wrapper-content-${params.DynamicPlaceholderId}`;

  return (
    <section className={`component section-wrapper py-10 lg:py-16 ${styles}`} id={id}>
      <div className="container">
        <div className="mb-12 space-y-4 text-center">
          <h2>
            <Text field={fields.Title} editable={editable} />
          </h2>
          <p className="text-foreground-light text-xl">
            <Text field={fields.Description} editable={editable} />
          </p>
        </div>
      </div>
      <div>
        <Placeholder name={componentPlaceholderKey} rendering={rendering} />
      </div>
    </section>
  );
};
