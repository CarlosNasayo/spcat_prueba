import "./CheckFilter.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import {
  Carousel,
  CloseButton,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useState, useEffect } from "react";

function CheckFilter({
  onDataChange,
  title,
  onChange,
  crop,
  crops,
  toolTipTitle,
  toolTipDescription,
  idOnboarding,
  setIndexStep,
  itemm,
}) {
  const [tableItems, setTableItems] = useState([]);
  const [carouselItems, setCarouselItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [basaName, setBaseName] = useState([]);

  const handleAddToCarousel = (item) => {
    const filteredItems = tableItems.filter((tableItem) => tableItem !== item);
    setCarouselItems([...carouselItems, item]);
    setTableItems(filteredItems);
    if (title === "Major Crops") setIndexStep(2);
    else if (title === "Landrace Crops") setIndexStep(3);
  };

  const handleRemoveFromCarousel = (index) => {
    const itemToRemove = carouselItems.splice(index, 1)[0];
    setCarouselItems([...carouselItems]);
    setTableItems([...tableItems, itemToRemove].sort());
  };

  const handleSearchInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    if (onDataChange) {
      onDataChange([...carouselItems]);
    }
  }, [carouselItems]);

  useEffect(() => {
    setTableItems([...tableItems, ...carouselItems].sort());
    setCarouselItems([]);
  }, [onChange]);
  useEffect(() => {
    if (crop && crop.length > 0) {
      setTableItems([...crop].sort());
    }
    //console.log(crop)
  }, [crop]);

  const renderTooltip = (props) => <Tooltip>{props}</Tooltip>;
  return (
    <div className="mt-1 mb-4" id={idOnboarding}>
      <OverlayTrigger
        placement="top"
        overlay={renderTooltip(toolTipDescription)}
      >
        <span className="badge rounded-pill bg-primary me-1">
          {toolTipTitle}
        </span>
      </OverlayTrigger>
      {title}{" "}
      <div className="mb-0 d-flex justify-content-between align-items-center">
        <div className="position-relative w-100">
          <span className="position-absolute search">
            <FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon>
          </span>
          <input
            className="form-control w-100 rounded-0 rounded-top border "
            placeholder="Search by name..."
            value={searchValue}
            onChange={handleSearchInputChange}
          />
        </div>
      </div>
      <div
        className="table-responsive border rounded-bottom"
        style={{ height: "170px" }}
      >
        <table className="table table-responsive table-borderless table-striped table-hover">
  <tbody>
    {tableItems
      .filter((item) =>
        item.toLowerCase().includes(searchValue.toLowerCase())
      )
      .map((item, i) => (
        <tr key={i} onClick={() => handleAddToCarousel(item)}>
          <td className="text-left">
            {(() => {
              try {
                return (
                  <img
                    alt=""
                    src={require(`../../assets/icons/${item
                      .split(" ")[0]
                      .toLowerCase()}.png`)}
                    width="20"
                  />
                );
              } catch (err) {
                return (
                  <img
                    alt=""
                    src={require(`../../assets/icons/${itemm[0]
                      .split(" ")[0]
                      .toLowerCase()}.png`)}
                    width="20"
                  />
                );
              }
            })()}{" "}
            {item}
          </td>
        </tr>
      ))}
  </tbody>
</table>
      </div>
      <Carousel variant="dark" interval={null} controls={null} className="mt-2">
        {carouselItems
          .reduce((acc, item, i) => {
            if (i % 3 === 0) {
              acc.push([]);
            }
            acc[acc.length - 1].push(
              <div
                className="btn border border-top-0 px-3 py-1 rounded-3 me-1 hoverable"
                onClick={() => handleRemoveFromCarousel(i)}
                key={i}
              >
                {(() => {
                  try {
                    return (
                      <img
                        alt=""
                        src={require(`../../assets/icons/${carouselItems[i]
                          .split(" ")[0]
                          .toLowerCase()}.png`)}
                        width="20"
                      />
                    );
                  } catch (err) {
                    return (
                      <img
                        alt=""
                        src={
                          itemm &&
                          require(`../../assets/icons/${itemm[0]
                            .split(" ")[0]
                            .toLowerCase()}.png`)
                        }
                        width="20"
                      />
                    );
                  }
                })()}{" "}
                {item}
                <CloseButton
                  disabled
                  className="ms-1 close-button"
                ></CloseButton>
              </div>
            );
            return acc;
          }, [])
          .map((itemGroup, i) => (
            <Carousel.Item key={i}>{itemGroup}</Carousel.Item>
          ))}
      </Carousel>
    </div>
  );
}

export default CheckFilter;
