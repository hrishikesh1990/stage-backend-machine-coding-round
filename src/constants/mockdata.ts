import { genre } from './constants';

function getUniqueRandom() {
    const num = Array(14).fill(0).map((_, index) => index + 1);
    const rn = num.sort(() => Math.random() - 0.5).slice(0, 3);
    return rn;
}

export const mockMovies =
    Array(40).fill(0).map((_, index) => {
        return {
            title: `Movie ${index + 1}`,
            description: `Description of Movie ${index + 1}`,
            genres: getUniqueRandom().map(number => genre[number - 1]),
            releaseDate: new Date().toISOString(),
            director: 'Director ' + Math.floor(Math.random() * 10),
            actors: getUniqueRandom().map(number => `Actor ${number}`),
        }
    });

export const mockTvShows =
    Array(40).fill(0).map((_, index) => {
        const director = `Director ${Math.floor(Math.random() * 10)}`;
        const actors = getUniqueRandom().map(number => `Actor ${number}`);
        return {
            title: `TV Show ${index + 1}`,
            description: `Description of TV Show ${index + 1}`,
            genres: getUniqueRandom().map(number => genre[number - 1]),
            episodes: Array(getUniqueRandom()[0]).fill(0).map((_, epIndex) => {
                return {
                    episodeNumber: epIndex + 1,
                    seasonNumber: Math.floor(Math.random() * 10) + 1,
                    title: `Show ${index + 1} Episode ${epIndex + 1}`,
                    releaseDate: new Date().toISOString(),
                    director, actors,
                }
            }),
        }
    });
