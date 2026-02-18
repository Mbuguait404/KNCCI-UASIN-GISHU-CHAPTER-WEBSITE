export interface BoardMember {
    name: string;
    role: string;
    category: "Executive" | "Director" | "Secretariat";
    description?: string;
    image?: string;
}

export const boardMembers: BoardMember[] = [
    {
        name: "Willy K. Kenei",
        role: "Chairman KNCCI Uasin Gishu Chapter",
        category: "Executive",
        description: "Chairperson",
        image: "https://solby.sfo3.digitaloceanspaces.com/1771437540021-kenei.jpeg",
    },
    {
        name: "Gilbert Serem",
        role: "Vice-Chairman KNCCI Uasin Gishu Chapter",
        category: "Executive",
        description: "Vice-Chairperson",
        image: "https://solby.sfo3.digitaloceanspaces.com/1771437806325-gilbertserem.jpeg",
    },
    {
        name: "Alice Karanja",
        role: "Investment and Economic Diplomacy",
        category: "Director",
        image: "https://solby.sfo3.digitaloceanspaces.com/1771437797064-alicekaranja.jpg",
    },
    {
        name: "Allan Rop",
        role: "Director",
        category: "Director",
        image: "https://solby.sfo3.digitaloceanspaces.com/1771437809063-allanrop.jpg",
    },
    {
        name: "Noeline Maru",
        role: "Director",
        category: "Director",
        image: "https://solby.sfo3.digitaloceanspaces.com/1771437537010-noeline.jpeg",
    },
    {
        name: "Isaac Chumba",
        role: "Youth in Business",
        category: "Director",
        image: "https://solby.sfo3.digitaloceanspaces.com/1771437540089-isaacchumba.jpeg",
    },
    {
        name: "Girish Khetia",
        role: "Wholesale, Retail and Distribution",
        category: "Director",
        image: "https://solby.sfo3.digitaloceanspaces.com/1771437805899-GirishKhetia.png",
    },
    {
        name: "Lillian Bitok",
        role: "Agribusiness and Agroprocessing",
        category: "Director",
        image: "https://solby.sfo3.digitaloceanspaces.com/1771437536834-lillianbitok.jpeg",
    },
    {
        name: "Ravi Ramtilal",
        role: "Manufacturing/Industrialisation",
        category: "Director",
        image: "https://solby.sfo3.digitaloceanspaces.com/1771437542394-raviramtilal.jpeg",
    },
    {
        name: "Yona Odek",
        role: "Devolution and Legislation affairs",
        category: "Director",
        image: "https://solby.sfo3.digitaloceanspaces.com/1771437538713-yonaodek.jpeg",
    },
    {
        name: "Gilbert Serem",
        role: "Director",
        category: "Director",
        image: "https://solby.sfo3.digitaloceanspaces.com/1771437806325-gilbertserem.jpeg",
    },
    {
        name: "CPA Kiplimo",
        role: "Training/ICT and E-commerce",
        category: "Director",
        image: "https://solby.sfo3.digitaloceanspaces.com/1771437809356-cpakiplimo.jpg",
    },
    {
        name: "Evans Kimaina",
        role: "Finance and Audit",
        category: "Director",
        image: "https://solby.sfo3.digitaloceanspaces.com/1771437538542-kimaina.jpeg",
    },
    {
        name: "Robert Misoi",
        role: "Tourism and Hospitality",
        category: "Director",
        image: "https://solby.sfo3.digitaloceanspaces.com/1771437538846-robertmisoi.jpeg",
    },
    {
        name: "Dr. Anthony Njoroge",
        role: "Health and Medical Industry",
        category: "Director",
        image: "https://solby.sfo3.digitaloceanspaces.com/1771437800403-dranthonynjoroge.jpeg",
    },
    {
        name: "Seth Willy Ogutu",
        role: "Membership Development and Recruitment",
        category: "Director",
        image: "https://solby.sfo3.digitaloceanspaces.com/1771437536581-sethogutu.jpeg",
    },
    {
        name: "Anil Sutar",
        role: "Construction and Real Estate",
        category: "Director",
        image: "https://solby.sfo3.digitaloceanspaces.com/1771437798204-anilsutar.jpeg",
    },
    {
        name: "Collins Kipchumba",
        role: "CEO and Head of the Secretariat",
        category: "Secretariat",
        image: "https://solby.sfo3.digitaloceanspaces.com/1771437800787-collinskipchumba.jpeg",
    },
    {
        name: "Veronica Cheruiyot",
        role: "Membership and Programs Officer",
        category: "Secretariat",
        image: "https://solby.sfo3.digitaloceanspaces.com/1771437573515-veronica.jfif",
    },
];
