import React from "react"
import { AlertDialog, Button, Center } from "native-base"
import updateLeaveRecordID from "../controller/updateLeaveRecordID"
export default AlertDialogBox = ({ isOpen, setIsOpen, leaveRecords, id }) => {

    let record = leaveRecords.filter((r) => r.userID === id)
    //console.log(record[0].reason);
    const onClose = () => setIsOpen(false)

    const cancelRef = React.useRef(null)
    if (record.length > 0) {
        return (
            <Center>
                <AlertDialog
                    leastDestructiveRef={cancelRef}
                    isOpen={isOpen}
                    onClose={onClose}
                >
                    <AlertDialog.Content>
                        <AlertDialog.CloseButton />
                        <AlertDialog.Header>Leave Reason</AlertDialog.Header>
                        <AlertDialog.Body>
                            {record[0].reason}
                        </AlertDialog.Body>
                        <AlertDialog.Footer>
                            <Button.Group space={2}>
                                <Button
                                    variant="unstyled"
                                    colorScheme="coolGray"
                                    onPress={() => {
                                        updateLeaveRecordID(record[0].leaveRecordID, "denied");
                                        onClose()
                                    }}
                                    ref={cancelRef}
                                >
                                    Deny
                                </Button>
                                <Button colorScheme="danger" onPress={() => {
                                    updateLeaveRecordID(record[0].leaveRecordID, "granted");
                                    onClose()
                                }}>
                                    Grant
                                </Button>
                            </Button.Group>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                </AlertDialog>
            </Center>
        )
    } else return <></>
}