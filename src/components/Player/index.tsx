
import { useContext, useEffect, useRef } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';
import Image from 'next/image';
import styles from './styles.module.scss';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export function Player() {

    const audioRef = useRef<HTMLAudioElement>(null); // tipando com elemento HTML

    const { episodeList, currentEpisodeIndex, isPlaying, tooglePlay, setPlayingState} = useContext(PlayerContext)
    const episode = episodeList[currentEpisodeIndex]

    useEffect(() =>{
        if(!audioRef.current){ // se nao tiver nada 
            return; // nao retorna nada 
        }

        if(isPlaying){ //se isPlaying receber um valor true
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying])

    return (
        <div className={styles.playerContainer}>

            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora </strong>
            </header>

            { episode ? ( // se tive algum episodio selecionado mostra isso
                <div className={styles.currentEpisode}>
                    <Image
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        objectFit="cover"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>

            ) : ( // se nao tiver nenhum episodio selecionado mostra isso
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>00:00</span>
                    <div className={styles.slider}>

                        {episode ? (
                            <Slider
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}

                    </div>
                    <span>00:00</span>
                </div>

                {/* audio */}
                {episode && (
                    <audio
                        src={episode.url}
                        ref={audioRef}
                        autoPlay
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                    />
                )}


                <div className={styles.buttons}>
                    <button type="button" disabled={!episode}>
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>

                    <button type="button" disabled={!episode}>
                        <img src="/play-previous.svg" alt="Tocar anterior" />
                    </button>

                    <button
                        type="button"
                        className={styles.playButton}
                        disabled={!episode}
                        onClick={tooglePlay}>
                        {isPlaying
                            ? <img src="/pause.svg" alt="Pausar" />
                            : <img src="/play.svg" alt="Tocar" />
                        }
                    </button>

                    <button type="button" disabled={!episode}>
                        <img src="/play-next.svg" alt="Tocar proxima" />
                    </button>

                    <button type="button" disabled={!episode}>
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div>
    )
};

