import { Block, ButtonBlock, LinkBlock, TextBlock, ImageBlock, LinkItem } from '../types/block-types';

/**
 * Generate a stable link key for tracking
 */
export function generateLinkKey(campaignId: string, blockType: 'button' | 'link', index: number): string {
    return `${campaignId}_${blockType}_${index + 1}`;
}

/**
 * Extract all links and buttons from Unlayer design
 * This parses the HTML to find button and link blocks
 */
export function extractLinksAndButtons(html: string): LinkItem[] {
    const items: LinkItem[] = [];

    // Parse HTML using DOMParser
    if (typeof window === 'undefined') {
        // Server-side: return empty array
        return items;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Find all buttons (usually styled links or button elements)
    const buttons = doc.querySelectorAll('a[href].button, a[href][style*="background"], table a[href]');
    buttons.forEach((button, index) => {
        const url = button.getAttribute('href');
        const text = button.textContent?.trim() || '';

        if (url && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
            items.push({
                id: `button_${index}`,
                type: 'button',
                text: text || 'Button',
                url: url,
                link_label: '', // To be filled by user
            });
        }
    });

    // Find all regular links (not buttons)
    const links = doc.querySelectorAll('a[href]:not(.button)');
    links.forEach((link, index) => {
        const url = link.getAttribute('href');
        const text = link.textContent?.trim() || '';

        // Skip if already captured as button
        const isButton = Array.from(buttons).some(btn => btn === link);

        if (url && !isButton && !url.startsWith('mailto:') && !url.startsWith('tel:') && !url.startsWith('{{')) {
            items.push({
                id: `link_${index}`,
                type: 'link',
                text: text || 'Link',
                url: url,
                link_label: '', // To be filled by user
            });
        }
    });

    return items;
}

/**
 * Transform Unlayer design JSON to custom block structure
 */
export function transformUnlayerToBlocks(
    design: any,
    html: string,
    campaignId: string,
    linkLabels: Map<string, string>
): Block[] {
    const blocks: Block[] = [];

    // For now, we'll create a simplified block structure
    // This parses the HTML to extract blocks

    if (typeof window === 'undefined') {
        // Server-side: return basic text block
        return [{
            id: 'block_1',
            type: 'text',
            html: html,
        }];
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extract body content
    const bodyContent = doc.body;

    // Find all table rows (Unlayer uses tables for layout)
    const rows = bodyContent.querySelectorAll('tr');

    let buttonIndex = 0;
    let linkIndex = 0;
    let blockIndex = 0;

    rows.forEach((row) => {
        // Check for buttons
        const buttonLinks = row.querySelectorAll('a[href].button, a[href][style*="background"], table a[href]');
        buttonLinks.forEach((buttonEl) => {
            const url = buttonEl.getAttribute('href');
            const label = buttonEl.textContent?.trim() || '';

            if (url && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
                const id = `button_${buttonIndex}`;
                const link_key = generateLinkKey(campaignId, 'button', buttonIndex);
                const link_label = linkLabels.get(id) || '';

                blocks.push({
                    id: `block_${blockIndex++}`,
                    type: 'button',
                    label: label,
                    url: url,
                    link_label: link_label,
                    link_key: link_key,
                } as ButtonBlock);

                buttonIndex++;
            }
        });

        // Check for regular links
        const regularLinks = row.querySelectorAll('a[href]:not(.button)');
        regularLinks.forEach((linkEl) => {
            const url = linkEl.getAttribute('href');
            const text = linkEl.textContent?.trim() || '';

            // Skip if already captured as button or is merge tag
            const isButton = Array.from(buttonLinks).some(btn => btn === linkEl);

            if (url && !isButton && !url.startsWith('mailto:') && !url.startsWith('tel:') && !url.startsWith('{{')) {
                const id = `link_${linkIndex}`;
                const link_key = generateLinkKey(campaignId, 'link', linkIndex);
                const link_label = linkLabels.get(id) || '';

                blocks.push({
                    id: `block_${blockIndex++}`,
                    type: 'link',
                    text: text,
                    url: url,
                    link_label: link_label,
                    link_key: link_key,
                } as LinkBlock);

                linkIndex++;
            }
        });

        // Check for images
        const images = row.querySelectorAll('img[src]');
        images.forEach((img) => {
            const src = img.getAttribute('src');
            const alt = img.getAttribute('alt') || '';

            if (src) {
                blocks.push({
                    id: `block_${blockIndex++}`,
                    type: 'image',
                    src: src,
                    alt: alt,
                } as ImageBlock);
            }
        });

        // Extract text content (excluding links and buttons)
        const textContent = row.textContent?.trim();
        if (textContent && !row.querySelector('a[href]') && !row.querySelector('img[src]')) {
            const rowHtml = row.innerHTML;
            if (rowHtml) {
                blocks.push({
                    id: `block_${blockIndex++}`,
                    type: 'text',
                    html: rowHtml,
                } as TextBlock);
            }
        }
    });

    // If no blocks extracted, return the full HTML as a text block
    if (blocks.length === 0) {
        blocks.push({
            id: 'block_1',
            type: 'text',
            html: html,
        });
    }

    return blocks;
}

/**
 * Auto-generate link label suggestion from URL
 */
export function suggestLinkLabel(url: string): string {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;

        // Extract meaningful part from path
        const parts = pathname.split('/').filter(p => p.length > 0);
        if (parts.length > 0) {
            const lastPart = parts[parts.length - 1];
            // Capitalize and clean up
            return lastPart
                .replace(/[-_]/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());
        }

        // Use domain name
        return urlObj.hostname.replace('www.', '').split('.')[0]
            .replace(/\b\w/g, l => l.toUpperCase());
    } catch {
        return 'Link';
    }
}
