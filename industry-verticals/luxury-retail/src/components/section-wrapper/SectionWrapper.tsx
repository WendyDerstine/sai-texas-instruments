import { ComponentProps } from '@/lib/component-props';
import {
  Field,
  Link,
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
  const searchbarPlaceholderKey = `section-wrapper-searchbar-${params.DynamicPlaceholderId}`;
  const componentPlaceholderKey = `section-wrapper-content-${params.DynamicPlaceholderId}`;

  return (
    <section className={`component section-wrapper py-10 lg:py-16 ${styles}`} id={id}>
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="space-y-8 lg:col-span-3">
            <h2>
              <Text field={fields.Title} editable={editable} />
            </h2>
            <p className="text-xl">
              <Text field={fields.Description} editable={editable} />
            </p>
            <Link field={fields.Link} className="outline-btn justify-self-start" editable={editable} />
          </div>
          <div className="max-lg:order-last">
            <Placeholder name={searchbarPlaceholderKey} rendering={rendering} />
          </div>
        </div>
      </div>
      <div>
        <Placeholder name={componentPlaceholderKey} rendering={rendering} />
      </div>
    </section>
  );
};
