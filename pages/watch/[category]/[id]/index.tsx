import { IEpisode } from "@types";
import { Meta } from "components/Meta";
import axiosClient from "configs/axiosClient";
import { resizeImageLoklok } from "constants/global";
import useSaveHistoryView from "hooks/useSaveHistoryView";
import { LayoutPrimary } from "layouts/LayoutPrimary";
import { CommentList } from "modules/CommentList";
import { MediaPlayer } from "modules/MediaPlayer";
import { MovieCard } from "modules/MovieCard";
import { MovieList } from "modules/MovieList";
import { RelatedSeries } from "modules/RelatedSeries";
import { WatchActions } from "modules/WatchActions";
import { WatchAnthology } from "modules/WatchAnthology";
import { WatchCategory } from "modules/WatchCategory";
import { WatchMeta } from "modules/WatchMeta";
import { WatchStar } from "modules/WatchStar";
import { WatchSummary } from "modules/WatchSummary";
import { GetStaticPaths, GetStaticPropsContext } from "next";
import classNames from "utils/classNames";
import styles from "styles/watch.module.scss";

interface WatchTVPageProps {
  data: IEpisode;
}

const WatchTVPage = ({ data }: WatchTVPageProps) => {
  useSaveHistoryView(data);
  return (
    <LayoutPrimary>
      <Meta
        title={`${data.name} - NetFilm Watch HD movies online for free`}
        description={data.introduction}
        image={resizeImageLoklok(data.coverHorizontalUrl, 800, 418)}
      />
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.layoutMain}>
            <MediaPlayer
              qualities={data.qualities}
              subtitles={data.subtitles}
              poster={data.coverHorizontalUrl}
            />
            <h1 className={styles.heading}>
              {data.name} {data.currentEpName && `- ${data.currentEpName}`}
            </h1>
            <div className={styles.meta}>
              <WatchMeta
                areaList={data.areaList}
                currentEpisode={data.currentEpisode}
                episodeCount={data.episodeCount}
                year={data.year}
                score={data.score}
              />
              <WatchActions
                id={data.id}
                title={data.name}
                domainType={data.category}
                poster={data.coverVerticalUrl}
              />
            </div>
            <WatchCategory categories={data.tagList} />
            <WatchSummary introduction={data.introduction} />
            <WatchStar starList={data.starList} />
          </div>
          <div className={classNames(styles.layoutSidebar, "scrollbar")}>
            <WatchAnthology detailMovie={data} />
            <RelatedSeries refList={data.refList} />
          </div>
        </div>
        <div className={styles.layoutMain}>
          <CommentList />
        </div>
        <MovieList heading="You may like">
          {data.likeList.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.name}
              poster={movie.coverVerticalUrl}
              domainType={movie.category}
            />
          ))}
        </MovieList>
      </div>
    </LayoutPrimary>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  const category = params?.category as string;
  const id = params?.id as string;
  try {
    const { data } = await axiosClient.get(`/api/episode/`, {
      params: { category, id },
    });
    return {
      props: { data },
      revalidate: 300,
    };
  } catch (error) {
    return {
      props: {},
      revalidate: 60,
      notFound: true,
    };
  }
};

export default WatchTVPage;
