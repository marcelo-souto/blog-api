import slugify from 'slugify';

const options = {
	replacement: '_',
	remove: /[.,\/#!$%\^&\*;:{}=\-_`~()]/g,
	lower: true,
	strict: true,
	locale: 'pt'
};

const createSlug = (title) => {
	const slug = slugify(title, options);
	return slug + '_' + Date.now();
};

export default createSlug;
