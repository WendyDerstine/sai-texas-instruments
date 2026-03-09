import {
  ComponentParams,
  ComponentRendering,
  Image,
  ImageField,
  Link,
  LinkField,
  Placeholder,
  RichText,
  RichTextField,
  Text,
  TextField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import React from 'react';

interface Fields {
  TitleOne: TextField;
  TitleTwo: TextField;
  TitleThree: TextField;
  TitleFour: TextField;
  TitleFive: TextField;
  CopyrightText: TextField;
  PolicyText: LinkField;
  TermsText: LinkField;
  Logo: ImageField;
  Description: RichTextField;
}

type FooterProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: FooterProps) => {
  const { page } = useSitecore();
  const editable = page?.mode?.isEditing ?? false;
  const id = props.params.RenderingIdentifier;

  const phKeyOne = `footer-list-first-${props?.params?.DynamicPlaceholderId}`;
  const phKeyTwo = `footer-list-second-${props?.params?.DynamicPlaceholderId}`;
  const phKeyThree = `footer-list-third-${props?.params?.DynamicPlaceholderId}`;
  const phKeyFour = `footer-list-fourth-${props?.params?.DynamicPlaceholderId}`;
  const phKeyFive = `footer-list-fifth-${props?.params?.DynamicPlaceholderId}`;

  const sections = [
    {
      key: 'first_nav',
      title: <Text field={props.fields.TitleOne} editable={editable} />,
      content: <Placeholder name={phKeyOne} rendering={props.rendering} />,
    },
    {
      key: 'second_nav',
      title: <Text field={props.fields.TitleTwo} editable={editable} />,
      content: <Placeholder name={phKeyTwo} rendering={props.rendering} />,
    },
    {
      key: 'third_nav',
      title: <Text field={props.fields.TitleThree} editable={editable} />,
      content: <Placeholder name={phKeyThree} rendering={props.rendering} />,
    },
    {
      key: 'fourth_nav',
      title: <Text field={props.fields.TitleFour} editable={editable} />,
      content: <Placeholder name={phKeyFour} rendering={props.rendering} />,
    },
    {
      key: 'fifth_nav',
      title: <Text field={props.fields.TitleFive} editable={editable} />,
      content: <Placeholder name={phKeyFive} rendering={props.rendering} />,
    },
  ];

  return (
    <section
      className={`component footer relative text-[#E0E0E0] ${props.params.styles} overflow-hidden [&_.link-list_h1]:text-white [&_.link-list_h2]:text-white [&_.link-list_h3]:text-white [&_.link-list_h4]:text-white [&_.link-list_h5]:text-white [&_.link-list_h6]:text-white [&_.social-follow]:text-white [&_.social-follow_svg_path]:fill-white [&_a]:text-[#E0E0E0] [&_a]:transition-colors [&_a:hover]:text-white`}
      id={id}
    >
      {/* Top section: nav columns + connect */}
      <div className="bg-[#1A1A1A]">
        <div className="container grid gap-12 py-28.5 lg:grid-cols-[1fr_3fr]">
          <div className="flex flex-col gap-7">
            <div className="sm:max-w-[17rem] [&_img]:brightness-0 [&_img]:invert">
              <Image field={props.fields.Logo} editable={editable} />
            </div>
            <RichText field={props.fields.Description} editable={editable} />
          </div>
          <div className="grid gap-13 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5 xl:gap-12">
            {sections.map(({ key, title, content }) => (
              <div key={key}>
                <div className="mb-8 text-lg font-bold tracking-wide text-[#E0E0E0] uppercase">
                  {title}
                </div>
                <div className="space-y-4">{content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Bottom section: legal links + copyright */}
      <div className="border-t border-white/10 bg-[#1A1A1A]">
        <div className="container flex items-center justify-between py-8.5 max-sm:flex-col max-sm:items-start max-sm:gap-10">
          <div className="max-sm:order-2">
            <Text field={props.fields.CopyrightText} editable={editable} />
          </div>
          <div className="flex items-center justify-between gap-20 max-lg:gap-10 max-sm:order-1 max-sm:flex-col max-sm:items-start max-sm:gap-5 [&_a:not(:last-child)]:mr-5 [&_a:not(:last-child)]:border-r [&_a:not(:last-child)]:border-white/10 [&_a:not(:last-child)]:pr-5">
            <Link field={props.fields.TermsText} className="hover:underline" editable={editable} />
            <Link field={props.fields.PolicyText} className="hover:underline" editable={editable} />
          </div>
        </div>
      </div>
    </section>
  );
};
