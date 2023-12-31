import { Modal, Box } from "@mui/material"

type Props = {
    open: boolean
    setOpen: (open: boolean) => void
    activeItem: any
    Component: any
    setRoute?: (route: string) => void
    refetch?:any;
}

const CustomModal = ({open, setOpen, activeItem, Component, setRoute, refetch}: Props) => {
  return (
    <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-gray-900 rounded-[8px] shadow p-4 outline-none">
        <Component setOpen={setOpen} setRoute={setRoute} refetch={refetch}/>
      </Box>
    </Modal>
  )
}

export default CustomModal
