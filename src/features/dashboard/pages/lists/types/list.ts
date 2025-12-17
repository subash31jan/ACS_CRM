export type List = {
    listId: string;
    listName: string;
    contactsCount: number;
    creationDate: string;
    updatedAt?: string;
    description?: string;
    tags?: string[];
};

export const mockLists: List[] = [
    {
        listId: "LST-001",
        listName: "Newsletter Subscribers",
        contactsCount: 1250,
        creationDate: "2024-01-15",
        description: "Monthly newsletter subscribers",
        tags: ["newsletter", "marketing"],
    },
    {
        listId: "LST-002",
        listName: "Premium Customers",
        contactsCount: 342,
        creationDate: "2024-02-20",
        description: "High-value customer segment",
        tags: ["premium", "vip"],
    },
    {
        listId: "LST-003",
        listName: "Event Attendees",
        contactsCount: 567,
        creationDate: "2024-03-10",
        description: "Contacts from recent events",
        tags: ["events", "networking"],
    },
    {
        listId: "LST-004",
        listName: "Product Launch",
        contactsCount: 890,
        creationDate: "2024-04-05",
        description: "New product launch campaign",
        tags: ["product", "launch"],
    },
    {
        listId: "LST-005",
        listName: "Inactive Contacts",
        contactsCount: 423,
        creationDate: "2024-05-12",
        description: "Re-engagement campaign list",
        tags: ["inactive", "reengagement"],
    },
];
