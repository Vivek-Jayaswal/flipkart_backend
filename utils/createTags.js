const STOP_WORDS = ["for", "and", "with", "the", "a", "an", "&"];

const createTags = ({ title, brandName, categoryNames = [] }) => {
  const tags = [];

  if (title) {
    const titleTags = title
      .toLowerCase()
      .split(/\s+/)
      .map((tag) => tag.trim())
      .filter((tag) => tag && !STOP_WORDS.includes(tag));

    tags.push(...titleTags);
  }

  if (brandName) {
    tags.push(brandName.toLowerCase());
  }

  categoryNames.forEach((category) => {
    tags.push(category.toLowerCase());
  });

  return [...new Set(tags)];
};

module.exports = {
  createTags,
};
