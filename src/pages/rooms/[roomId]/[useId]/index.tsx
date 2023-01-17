import { NextPage } from "next";
import { useRouter } from "next/router";

const RoomSession: NextPage = () => {
  const router = useRouter();

  const params = router.query;

  return (
    <div>
      <h3>Hail to You</h3>
    </div>
  );
};
