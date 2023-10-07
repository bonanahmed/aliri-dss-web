import { usePathname } from "next/navigation";
import { Fragment, createElement } from "react";

const CreateElement = ({
  components,
  items,
}: {
  components: any;
  items: any[];
}) => {
  const pathname = usePathname();
  const chooseComponent = (item: any) => {
    const element = createElement(components[item._tag], {
      ...item,
      ...{ components },
      pathname,
    });
    return element;
  };
  return (
    <ul className="mb-6 flex flex-col gap-1.5">
      {items.map((item, index) => (
        <Fragment key={`${item._tag}${item.name}${index}`}>
          {chooseComponent(item)}
        </Fragment>
      ))}
    </ul>
  );
};

export default CreateElement;
