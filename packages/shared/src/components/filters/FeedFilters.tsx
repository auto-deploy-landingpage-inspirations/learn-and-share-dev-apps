import React, { ReactElement, useState } from 'react';
import {
  HashtagIcon,
  FilterIcon,
  BlockIcon,
  ArrowIcon,
  AppIcon,
} from '../icons';
import TagsFilter from './TagsFilter';
import { TagCategoryLayout } from './TagCategoryDropdown';
import AdvancedSettingsFilter from './AdvancedSettings';
import BlockedFilter from './BlockedFilter';
import { Button, ButtonSize } from '../buttons/Button';
import { UnblockItem, unBlockPromptOptions } from './FilterMenu';
import { Modal, ModalProps } from '../modals/common/Modal';
import { usePrompt } from '../../hooks/usePrompt';
import { UnblockSourceCopy, UnblockTagCopy } from './UnblockCopy';
import { ContentTypesFilter } from './ContentTypesFilter';

enum FilterMenuTitle {
  Tags = 'Manage tags',
  Advanced = 'Advanced',
  ContentTypes = 'Content types',
  Blocked = 'Blocked items',
}

type FeedFiltersProps = ModalProps;

export default function FeedFilters(props: FeedFiltersProps): ReactElement {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { showPrompt } = usePrompt();
  const unBlockPrompt = async ({ action, source, tag }: UnblockItem) => {
    const description = tag ? (
      <UnblockTagCopy name={tag} />
    ) : (
      <UnblockSourceCopy name={source.name} />
    );
    if (await showPrompt({ ...unBlockPromptOptions, description })) {
      action?.();
    }
  };
  const tabs = [
    {
      title: FilterMenuTitle.Tags,
      options: { icon: <HashtagIcon /> },
    },
    {
      title: FilterMenuTitle.Advanced,
      options: { icon: <FilterIcon /> },
    },
    {
      title: FilterMenuTitle.ContentTypes,
      options: { icon: <AppIcon /> },
    },
    {
      title: FilterMenuTitle.Blocked,
      options: { icon: <BlockIcon /> },
    },
  ];
  return (
    <Modal
      {...props}
      className="h-full flex-1 overflow-auto"
      kind={Modal.Kind.FixedCenter}
      size={Modal.Size.XLarge}
      tabs={tabs}
    >
      <Modal.Sidebar>
        <Modal.Sidebar.List
          className="w-74"
          title="Feed filters"
          isNavOpen={isNavOpen}
          setIsNavOpen={setIsNavOpen}
          onViewChange={() => setIsNavOpen(false)}
        />
        <Modal.Sidebar.Inner>
          <Modal.Header>
            <Button
              size={ButtonSize.Small}
              className="mr-2 flex -rotate-90 tablet:hidden"
              icon={<ArrowIcon />}
              onClick={() => setIsNavOpen(true)}
            />
          </Modal.Header>
          <Modal.Body view={FilterMenuTitle.Tags}>
            <TagsFilter tagCategoryLayout={TagCategoryLayout.Settings} />
          </Modal.Body>
          <Modal.Body view={FilterMenuTitle.Advanced}>
            <AdvancedSettingsFilter />
          </Modal.Body>
          <Modal.Body view={FilterMenuTitle.ContentTypes}>
            <ContentTypesFilter />
          </Modal.Body>
          <Modal.Body view={FilterMenuTitle.Blocked}>
            <BlockedFilter onUnblockItem={unBlockPrompt} />
          </Modal.Body>
        </Modal.Sidebar.Inner>
      </Modal.Sidebar>
    </Modal>
  );
}
