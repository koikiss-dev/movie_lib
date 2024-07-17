import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import {
  useState,
  type ChangeEvent,
  type FC,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
interface SearchMovieProps {}

interface Movies {
  name: string;
  description: string;
  url: string;
  image: string;
}

const SKELETON_COUNT = 12;
const SearchMovie: FC<SearchMovieProps> = () => {
  const abortController = new AbortController();
  const [movies, setMovies] = useState<Movies[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movies[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMovies = useCallback(async () => {
    const url = "https://db2-peliculas-server.vercel.app";
    try {
      const { data } = await axios.get(`${url}/peliculas`, {
        signal: abortController.signal,
      });
      if (data) {
        setMovies(data);
        setFilteredMovies(data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(true);
      throw new Error("Error fetching movies");
    }
  }, []);

  const filterMovies = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const filterValue = event.target.value.toUpperCase();
      const filtered = movies.filter((movie) =>
        movie.name.toUpperCase().includes(filterValue)
      );
      setFilteredMovies(filtered);
    },
    [movies]
  );

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const renderSkeletons = () =>
    Array.from({ length: SKELETON_COUNT }).map((_, index) => (
      <Skeleton key={index} className="flex-1 h-[300px]" />
    ));
  return (
    <div className=" w-full">
      <Input onChange={filterMovies} placeholder="Search a movie" />
      <div className="">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-6">
          {loading
            ? renderSkeletons()
            : filteredMovies.map(({ name, image, description }, index) => (
                <Dialog key={index}>
                  <DialogTrigger>
                    <Card className="flex-1 border-0 shadow-none cursor-pointer active:scale-95 transition-all">
                      <CardContent className="p-0">
                        <img
                          width="200"
                          height="300"
                          className="w-full rounded-md"
                          src={image}
                          alt={name}
                        />
                      </CardContent>
                      <CardHeader className="py-1 px-0 text-left">
                        <CardTitle className="text-base truncate">
                          {name}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{name}</DialogTitle>
                      <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              ))}
        </div>
      </div>
    </div>
  );
};

export default SearchMovie;
