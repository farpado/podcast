import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { useContext } from 'react';
import { PlayerContext } from '../contexts/PlayerContext';
import { api } from '../services/api';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from '../pages/home.module.scss';


type Episode = { // tipagem
  id: string;
  title: string;
  members: string;
  thumbnail: string;
  description: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
}

type HomeProps = { // tipando o props
  latestEpisodes: Episode[]; // mostrando oque tem dentro do array na nossa api (objeto)
  allEpisodes: Episode[];
}


export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {

  const { play } = useContext(PlayerContext)
  return (

    <div className={styles.homepage}>
      <section className={styles.latesEpisodes}>
        <h2>Últimos Lançamentos </h2>

        <ul>
          {latestEpisodes.map(episodes => {
            return (
              <li key={episodes.id}>
                <Image
                  width={192}
                  height={192}
                  src={episodes.thumbnail}
                  alt={episodes.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episodes.id}`}>
                    <a>{episodes.title}</a>
                  </Link>
                  <p>{episodes.members}</p>
                  <span>{episodes.publishedAt}</span>
                  <span>{episodes.durationAsString}</span>
                </div>

                <button type="button" onClick={() => play(episodes)}>
                  <img src="/play-green.svg" alt="Tocar episodio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <table cellSpacing={0}>
          <thead>
            <tr>
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
            </tr>
          </thead>

          <tbody>
            {allEpisodes.map(episodes => {
              return (
                <tr key={episodes.id}>

                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episodes.thumbnail}
                      alt={episodes.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episodes.id}`}>
                      <a>{episodes.title}</a>
                    </Link>
                  </td>
                  <td>{episodes.members}</td>
                  <td style={{ width: 100 }}>{episodes.publishedAt}</td>
                  <td>{episodes.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="tocar episodio" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>

        </table>
      </section>

    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', { // pegando o link da API
    params: { // passando parametros para mostrar os itens
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episodes => {
    return {
      id: episodes.id,
      title: episodes.title,
      thumbnail: episodes.thumbnail,
      members: episodes.members,
      publishedAt: format(parseISO(episodes.published_at), 'd MMM yy', { locale: ptBR }), // formatando a data (na api esta em ordem errada)
      duration: Number(episodes.file.duration),
      durationAsString: convertDurationToTimeString(Number(episodes.file.duration)),
      description: episodes.description,
      url: episodes.file.url,
    };
  })

  const latestEpisodes = episodes.slice(0, 2); // aparece apenas os 2 ultimos ep
  const allEpisodes = episodes.slice(2, episodes.length); // aparece do 3° em diante


  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8, //vai alterar a api a cada 8 horas (pois tem apenas 1 podcasta por dia)
  }
}
