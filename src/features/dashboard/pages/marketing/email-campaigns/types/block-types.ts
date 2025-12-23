export type TextBlock = {
    id: string;
    type: 'text';
    html: string;
};

export type ButtonBlock = {
    id: string;
    type: 'button';
    label: string;
    url: string;
    link_label: string;   // Demo/Website/Survey
    link_key: string;     // stable identifier
    link_id?: string;     // added by backend after save
};

export type LinkBlock = {
    id: string;
    type: 'link';
    text: string;
    url: string;
    link_label: string;
    link_key: string;
    link_id?: string;
};

export type ImageBlock = {
    id: string;
    type: 'image';
    src: string;
    alt?: string;
};

export type Block = TextBlock | ButtonBlock | LinkBlock | ImageBlock;

export type ContentJson = {
    blocks: Block[];
};

export type LinkItem = {
    id: string;
    type: 'button' | 'link';
    text: string;
    url: string;
    link_label: string;
};
